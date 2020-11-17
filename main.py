#!/usr/bin/python
# -*- coding: utf-8 -*-

from github import Github
from github.Issue import Issue
from github.Repository import Repository
import os
import time
import urllib.parse
import codecs

user: Github
blog: Repository
cur_time: str


def format_issue(issue: Issue):
    return '- [%s](%s) \t\t\t %s \n\n' % (
        issue.title, issue.html_url, sub(issue.created_at))


def sup(text: str):
    return '<sup>%s</sup>' % text


def sub(text: str):
    return text


def update_readme_md_file(contents):
    print(contents)
    with codecs.open('README.md', 'w', encoding='utf-8') as f:
        f.writelines(contents)
        f.flush()
        f.close()


def login():
    global user
    print('GITHUB_ACCESS_TOKEN')
    user = Github('GITHUB_ACCESS_TOKEN')


def get_blog():
    global blog
    blog = user.get_repo('GITHUB_USER/LiuJiang-Blog')


def bundle_summary_section():
    global blog
    global cur_time
    global user

    total_label_count = blog.get_labels().totalCount
    total_issue_count = blog.get_issues().totalCount
    labels_html_url = 'https://github.com/%s/blog/labels' % user.get_user().login
    issues_html_url = 'https://github.com/%s/blog/issues' % user.get_user().login

    summary_section = '''
# GitHub Issues Blog
    
> 上次更新: %s
    
共 [%s](%s) 个标签, [%s](%s) 篇博文
''' % (cur_time, total_label_count, labels_html_url, total_issue_count, issues_html_url)

    return summary_section


def bundle_pinned_issues_section():
    global blog

    pinned_label = blog.get_label(':+1:置顶')
    pinned_issues = blog.get_issues(labels=(pinned_label,))

    pinned_issues_section = '\n## 置顶 :thumbsup: \n'

    for issue in pinned_issues:
        pinned_issues_section += format_issue(issue)

    return pinned_issues_section


def format_issue_with_labels(issue: Issue):
    global user

    labels = issue.get_labels()
    labels_str = ''
    if labels:
        labels_str = '\n :label: \t' + sub('|')

    for label in labels:
        labels_str += sub('[%s](https://github.com/%s/blog/labels/%s)\t|\t' % (
            label.name, user.get_user().login, urllib.parse.quote(label.name)))

    return '- [%s](%s) \t\t\t %s \n\n' % (
        issue.title, issue.html_url, sub(issue.created_at))


def bundle_new_created_section():
    global blog

    new_5_created_issues = blog.get_issues()[:5]

    new_created_section = '## 最新 \n'

    for issue in new_5_created_issues:
        new_created_section += format_issue_with_labels(issue)

    return new_created_section


def bundle_list_by_labels_section():
    global blog
    global user

    list_by_labels_section = '## 所有 \n'

    all_labels = blog.get_labels()

    for label in all_labels:
        temp = ''
        count = 0
        issues_in_label = blog.get_issues(labels=(label,))
        for issue in issues_in_label:
            temp += format_issue(issue)
            count += 1

        list_by_labels_section += '%s' % (temp)

    return list_by_labels_section


def execute():
    global cur_time
    # common
    cur_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

    # 1. login
    login()
    
    # 2. get blog
    get_blog() 

    # 3. summary section
    summary_section = bundle_summary_section()
    print(summary_section)

    # 4. new created section
    new_created_section = bundle_new_created_section()
    print(new_created_section)

    # 5. list by labels section
    list_by_labels_section = bundle_list_by_labels_section()
    print(list_by_labels_section)

    # 6. test
    contents = [summary_section, new_created_section, list_by_labels_section]
    update_readme_md_file(contents)

    print('README.md updated successfully!!!')


if __name__ == '__main__':
    execute()
