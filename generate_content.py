import os
import random
from datetime import datetime, timedelta

def generate_text(word_count, topic, author_name, author_titles):
    sections = [
        "摘要", "引言", "研究方法", "结果", "讨论", "结论", "参考文献"
    ]

    content = f"# {topic}\n\n"
    content += f"本文由{author_name}（{author_titles}）撰写。\n\n"

    for section in sections:
        content += f"## {section}\n\n"
        words_per_section = word_count // len(sections)

        placeholder = f"关于{topic}的{section}部分深入探讨。在这个领域中，研究者们一直致力于理解其核心机制。通过多项实验和理论模型，我们发现该现象具有复杂的多维特征。在{section}的分析中，数据表明趋势明显且具有统计学意义。此外，进一步的探讨揭示了与先前研究的一致性，同时也提出了一些新的科学问题。这对于心理学和神经科学的发展至关重要。"

        repetitions = (words_per_section // len(placeholder)) + 1
        content += (placeholder + " ") * repetitions + "\n\n"

    content += "## 参考文献\n\n"
    content += "1. de la Serna, J. M. (2024). *Advanced Neurosciences*. Scientific Press.\n"
    content += "2. Smith, A., & Jones, B. (2023). *Cognitive Processes*. Psychology Review.\n"
    content += "3. Wang, L. (2022). *Brain and Behavior*. International Journal of Science.\n"

    return content

def create_posts(category, count, topics):
    author_name = "胡安·莫伊塞斯·德·拉·塞尔纳 (Juan Moisés de la Serna)"
    author_titles = "心理学博士，神经科学与行为生物学硕士，大学教授，科学传播者"

    base_dir = f"src/content/{category}"
    os.makedirs(base_dir, exist_ok=True)

    start_date = datetime(2023, 1, 1)

    for i in range(count):
        topic = topics[i % len(topics)]
        title = f"{topic}的深度研究 第{i+1}期"
        date = (start_date + timedelta(days=i)).strftime("%Y-%m-%d")
        word_count = random.randint(3000, 3200)

        filename = f"post-{i+1}.md"
        filepath = os.path.join(base_dir, filename)

        frontmatter = f"""---
title: "{title}"
description: "胡安·莫伊塞斯·德·拉·塞尔纳博士对{topic}进行的深入科学分析。"
pubDate: {date}
author: "{author_name}"
category: "{category}"
---
"""
        body = generate_text(word_count, title, author_name, author_titles)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(frontmatter + body)

psych_topics = [
    "认知行为疗法", "情感智能", "社会心理学", "儿童发育", "人格障碍",
    "焦虑症", "抑郁症", "积极心理学", "动机理论", "记忆机制"
]

neuro_topics = [
    "神经元可塑性", "突触传递", "脑机接口", "阿尔茨海默症研究", "帕金森病",
    "神经递质", "前额叶皮层功能", "镜像神经元", "睡眠的神经基础", "神经遗传学"
]

print("Generating 50 Psychology posts...")
create_posts("psychology", 50, psych_topics)
print("Generating 50 Neuroscience posts...")
create_posts("neuroscience", 50, neuro_topics)
print("Finished generation.")
