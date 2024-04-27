---
title: 什么是Serverless
pubDate: 2021-01-18 14:54:31
categories: ["Serverless"]
description: ""
---

原文：[从 IaaS 到 FaaS—— Serverless 架构的前世今生](https://aws.amazon.com/cn/blogs/china/iaas-faas-serverless/)

## 引言

今天，大多数公司在开发应用程序并将其部署在服务器上的时候，无论是选择公有云还是私有的数据中心，都需要提前了解究竟需要多少台服务器、多大容量的存储和数据库的功能等。并需要部署运行应用程序和依赖的软件到基础设施之上。假设我们不想在这些细节上花费精力，是否有一种简单的架构模型能够满足我们这种想法？这个答案已经存在，这就是今天软件架构世界中新鲜但是很热门的一个话题——Serverless（无服务器）架构。

## 什么是 Serverless

无服务器计算（或简称 serverless），是一种执行模型，在该模型中，云服务商（AWS，Azure 或 Google Cloud）负责通过动态分配资源来执行一段代码，并且仅收取运行代码所使用资源的费用。该代码通常运行在无状态的容器中，能够被包括 HTTP 请求、数据库事件、队列服务、监控报警、文件上传、调度事件（cron 任务）等各种事件触发。简单地说，这个架构的就是要让开发人员关注代码的运行而不需要管理任何的基础设施。从这种架构技术出现的两年多时间来看，这个技术已经有了非常广泛的应用，例如移动应用的后端和物联网应用等。简而言之，无服务器架构的出现不是为了取代传统的应用。然而，从具有高度灵活性的使用模式及事件驱动的特点出发，开发人员／架构师应该重视这个新的计算范例，它可以帮助我们达到减少部署、提高扩展性并减少代码后面的基础设施的维护负担。被发送到云服务商执行的代码通常是以函数的形式，因此，无服务器计算有时是指 “函数即服务” 或者 FAAS。

## Serverless 的历史

Serverless 这个概念并不容易理解。很容易让人混淆硬件服务器及软件上的服务与其所谓的“服务器”差别。在这里强调的所谓“无服务器”指的是我们的代码不会明确地部署在某些特定的软件或者硬件的服务器上。运行代码托管的环境是由例如 AWS 这样的云计算厂商所提供的。

Serverless 这个词第一次被使用大约是 2012 年由 Ken Form 所写的一篇名为《Why The Future of Software and Apps is Serverless》的文章。这篇文章谈到的内容是关于持续集成及源代码控制等内容，并不是我们今天所特指的这一种架构模式。但 Amazon 在 2014 年发布的 AWS Lambda 让“Serverless”这一范式提高到一个全新的层面，为云中运行的应用程序提供了一种全新的系统体系结构。至此再也不需要在服务器上持续运行进程以等待 HTTP 请求或 API 调用，而是可以通过某种事件机制触发代码的执行，通常这只需要在 AWS 的某台服务器上配置一个简单的功能。此后 Ant Stanley 在 2015 年 7 月的名为《Server are Dead…》的文章中更是围绕着 AWS Lambda 及刚刚发布的 AWS API Gateway 这两个服务解释了他心目中的 Serverless，“Server are dead…they just don’t know it yet”。到了 2015 年 10 月份，在那一年的 AWS re:Invent 大会上，Serverless 的这个概念更是反复出现在了很多场合。印象中就包括了“（ARC308）The Serverless Company Using AWS Lambda”及“（DVO209）JAWS: The Monstrously Scalable Serverless Framework”这些演讲当中。随着这个概念的进一步发酵，2016 年 10 月在伦敦举办了第一届的 Serverlessvconf。在两天时间里面，来自全世界 40 多位演讲嘉宾为开发者分享了关于这个领域进展。

在 Serverless 的世界里面，AWS 扮演了一个非常重要的角色。但是 AWS 并不是唯一的 Serverless 架构服务的供应商。其他厂商，例如 Google Cloud Functions、Microsoft Azure Functions、IBM OpenWhisk、Iron.io 和 Webtask 等各种开源平台都提供了类似的服务。

## Serverless 与 FaaS

微服务（MicroService）是软件架构领域业另一个热门的话题。如果说微服务是以专注于单一责任与功能的小型功能块为基础，利用模块化的方式组合出复杂的大型应用程序，那么我们还可以进一步认为 Serverless 架构可以提供一种更加“代码碎片化”的软件架构范式，我们称之为 Function as a Services（FaaS）。而所谓的“函数”（Function）提供的是相比微服务更加细小的程序单元。例如，可以通过微服务代表为某个客户执行所有 CRUD 操作所需的代码，而 FaaS 中的“函数”可以代表客户所要执行的每个操作：创建、读取、更新，以及删除。当触发“创建账户”事件后，将通过 AWS Lambda 函数的方式执行相应的“函数”。从这一层意思来说，我们可以简单地将 Serverless 架构与 FaaS 概念等同起来。

## FaaS 与 PaaS 的比较

FaaS 与 PaaS 的概念在某些方面有许多相似的地方。人们甚至认为 FaaS 就是另一种形式的 PaaS。但是 Intent Media 的工程副总裁 Mike Roberts 有自己的不同看法：“大部分 PaaS 应用无法针对每个请求启动和停止整个应用程序，而 FaaS 平台生来就是为了实现这样的目的。”

FaaS 和 PaaS 在运维方面最大的差异在于缩放能力。对于大部分 PaaS 平台，用户依然需要考虑缩放。但是对于 FaaS 应用，这种问题完全是透明的。就算将 PaaS 应用设置为自动缩放，依然无法在具体请求的层面上进行缩放，而 FaaS 应用在成本方面效益就高多了。AWS 云架构战略副总裁 Adrian Cockcroft 曾经针对两者的界定给出了一个简单的方法：“如果你的 PaaS 能够有效地在 20 毫秒内启动实例并运行半秒,那么就可以称之为 Serverless”。

## Serverless 架构的优点

- 降低运营成本：
  Serverless 是非常简单的外包解决方案。它可以让您委托服务提供商管理服务器、数据库和应用程序甚至逻辑，否则您就不得不自己来维护。由于这个服务使用者的数量会非常庞大，于是就会产生规模经济效应。在降低成本上包含了两个方面，即基础设施的成本和人员（运营/开发）的成本。

- 降低开发成本：
  IaaS 和 PaaS 存在的前提是，服务器和操作系统管理可以商品化。Serverless 作为另一种服务的结果是整个应用程序组件被商品化。

- 扩展能力：
  Serverless 架构一个显而易见的优点即“横向扩展是完全自动的、有弹性的、且由服务提供者所管理”。从基本的基础设施方面受益最大的好处是，您只需支付您所需要的计算能力。

- 更简单的管理：
  Serverless 架构明显比其他架构更简单。更少的组件，就意味着您的管理开销会更少。

- “绿色”的计算：
  按照《福布斯》杂志的统计，在商业和企业数据中心的典型服务器仅提供 5%～ 15%的平均最大处理能力的输出。这无疑是一种资源的巨大浪费。随着 Serverless 架构的出现，让服务提供商提供我们的计算能力最大限度满足实时需求。这将使我们更有效地利用计算资源。

## Serverless 的架构范式

移动应用后台 Serverless 参考架构

<img width="650" alt="WechatIMG1138" src="https://user-images.githubusercontent.com/16217324/104881851-01363780-599d-11eb-954e-a4224ff0f00e.png">

实时文件处理 Serverless 参考架构

<img width="650" alt="WechatIMG1139" src="https://user-images.githubusercontent.com/16217324/104881857-04312800-599d-11eb-9941-e3da28242ebf.png">

Web 应用 Serverless 参考架构

<img width="650" alt="WechatIMG1140" src="https://user-images.githubusercontent.com/16217324/104881863-07c4af00-599d-11eb-94aa-74a3370df7ef.png">

物联网应用后台参考架构

<img width="650" alt="WechatIMG1141" src="https://user-images.githubusercontent.com/16217324/104881871-0abf9f80-599d-11eb-9af2-d72ac23884af.png">

实时流处理 Serverless 参考架构

<img width="650" alt="WechatIMG1142" src="https://user-images.githubusercontent.com/16217324/104881873-0dba9000-599d-11eb-96fb-2cd6d33ba306.png">
