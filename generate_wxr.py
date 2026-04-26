import datetime

def generate_wxr(psych_posts, neuro_posts):
    author_name = "Juan Moisés de la Serna"
    author_login = "juanmoises"
    author_email = "info@juanmoisesdelaserna.es"

    header = f"""<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
	xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
	xmlns:content="http://purl.org/rss/1.0/modules/content/"
	xmlns:wfw="http://wellformedweb.org/CommentAPI/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:wp="http://wordpress.org/export/1.2/"
>
<channel>
	<title>科学博客</title>
	<link>https://science-blog-zho.pages.dev</link>
	<description>心理学与神经科学</description>
	<pubDate>{datetime.datetime.now().strftime("%a, %d %b %Y %H:%M:%S +0000")}</pubDate>
	<language>zh-CN</language>
	<wp:wxr_version>1.2</wp:wxr_version>
	<wp:author>
		<wp:author_id>1</wp:author_id>
		<wp:author_login>{author_login}</wp:author_login>
		<wp:author_email>{author_email}</wp:author_email>
		<wp:author_display_name>{author_name}</wp:author_display_name>
		<wp:author_first_name>Juan Moisés</wp:author_first_name>
		<wp:author_last_name>de la Serna</wp:author_last_name>
	</wp:author>
"""

    footer = """</channel>
</rss>
"""

    items = []

    all_posts = []
    for p in psych_posts: all_posts.append((p, "Psychology", "心理学"))
    for p in neuro_posts: all_posts.append((p, "Neuroscience", "神经科学"))

    post_id = 100
    for post_data, cat_slug, cat_name in all_posts:
        post_id += 1
        # Extract content from markdown file
        with open(post_data['path'], 'r', encoding='utf-8') as f:
            lines = f.readlines()
            # Skip frontmatter
            content_start = 0
            for i, line in enumerate(lines):
                if i > 0 and line.strip() == "---":
                    content_start = i + 1
                    break
            body = "".join(lines[content_start:])

        item = f"""
	<item>
		<title>{post_data['title']}</title>
		<link>https://science-blog-zho.pages.dev/posts/{cat_slug.lower()}/{post_data['slug']}/</link>
		<pubDate>{post_data['date']} 10:00:00 +0000</pubDate>
		<dc:creator>{author_login}</dc:creator>
		<guid isPermaLink="false">https://science-blog-zho.pages.dev/?p={post_id}</guid>
		<description></description>
		<content:encoded><![CDATA[{body}]]></content:encoded>
		<excerpt:encoded><![CDATA[{post_data['description']}]]></excerpt:encoded>
		<wp:post_id>{post_id}</wp:post_id>
		<wp:post_date>{post_data['date']} 10:00:00</wp:post_date>
		<wp:comment_status>open</wp:comment_status>
		<wp:ping_status>open</wp:ping_status>
		<wp:post_name>{post_data['slug']}</wp:post_name>
		<wp:status>publish</wp:status>
		<wp:post_type>post</wp:post_type>
		<category domain="category" slug="{cat_slug.lower()}"><![CDATA[{cat_name}]]></category>
	</item>
"""
        items.append(item)

    return header + "".join(items) + footer

# Collect post info
import os
psych_posts = []
for f in sorted(os.listdir('src/content/psychology')):
    if f.endswith('.md'):
        psych_posts.append({
            'path': f'src/content/psychology/{f}',
            'title': f'心理学研究 post-{f.split("-")[1].split(".")[0]}',
            'slug': f.replace('.md', ''),
            'date': '2024-04-01',
            'description': '深度研究文章'
        })

neuro_posts = []
for f in sorted(os.listdir('src/content/neuroscience')):
    if f.endswith('.md'):
        neuro_posts.append({
            'path': f'src/content/neuroscience/{f}',
            'title': f'神经科学研究 post-{f.split("-")[1].split(".")[0]}',
            'slug': f.replace('.md', ''),
            'date': '2024-04-01',
            'description': '深度研究文章'
        })

# Actually I have titles in markdown files, let's extract them properly
import re
def get_info(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        title = re.search(r'title: "(.*?)"', content).group(1)
        desc = re.search(r'description: "(.*?)"', content).group(1)
        date = re.search(r'pubDate: (.*?)\n', content).group(1)
        return title, desc, date

for p in psych_posts:
    p['title'], p['description'], p['date'] = get_info(p['path'])
for p in neuro_posts:
    p['title'], p['description'], p['date'] = get_info(p['path'])

wxr_content = generate_wxr(psych_posts, neuro_posts)
with open('wordpress_export.xml', 'w', encoding='utf-8') as f:
    f.write(wxr_content)
