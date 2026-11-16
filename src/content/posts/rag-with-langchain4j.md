---
title: 用 LangChain4j 搭一个真正可用的 RAG 助手
description: 从切分、检索到重排与评估，聊聊一条能落地的 RAG 链路，而不只是跑通 Demo。
date: 2026-09-30
tags: [AI]
---

让大模型「基于文档回答」，在 Demo 阶段只需要几行代码。但要让它在真实场景里可用，问题会一个接一个出现：答案找不到出处、检索结果似是而非、文档更新后知识库不同步。

这篇文章想聊的，是一条相对完整的 RAG 链路，以及在 LangChain4j 里怎么把它串起来。

## RAG 到底在解决什么

RAG（Retrieval-Augmented Generation）的思路并不复杂：先从知识库里检索与问题相关的片段，再把片段作为上下文交给模型生成答案。

它解决的不是「模型不够聪明」，而是两个更具体的问题：

1. 模型的训练数据里没有你的私有知识。
2. 模型的记忆不可控，容易一本正经地编造。

检索负责提供事实，生成负责组织语言。二者缺一不可。

## 一条能被复用的链路

我习惯把 RAG 拆成五步：

```text
文档解析 -> 切分 -> 向量化 -> 检索（+重排） -> 生成
```

每一步都会影响最终效果，但影响最大的，往往不是模型，而是切分与检索。

很多「RAG 效果不好」的问题，最后都追到了这里：文档切得支离破碎，向量检索召回了看似相关却没有答案的片段，模型只能靠猜。

## 文档切分比模型更值得花时间

切分的目标不是把文本切成等长的小块，而是尽量让每一块都保持语义完整。

几个实践中的经验：

- **优先按结构切**：标题、章节、列表本身就是天然的边界。
- **保留元数据**：来源文件、章节标题、页码，这些信息在生成引用时非常重要。
- **控制重叠**：相邻片段保留少量重叠，避免一句话被切断后失去上下文。
- **片段不要过碎**：太短的片段缺乏信息量，太长的片段会稀释语义。

在 LangChain4j 里，`DocumentSplitters.recursive` 提供了一个不错的起点：

```java
DocumentSplitter splitter = DocumentSplitters.recursive(500, 80);
```

第一个参数是片段的 token 上限，第二个是重叠长度。具体数值需要根据文档类型调整，没有通用答案。

## 检索之后，还需要重排

向量检索擅长「语义相似」，但它并不总是理解「哪个片段真正回答了问题」。

一个常见的改进是**混合检索**：同时使用向量召回和关键词召回，再对候选结果做重排。关键词能抓住专有名词和精确术语，向量能覆盖同义表达，两者互补。

如果暂时没有重排模型，也可以先用简单的规则：标题命中的加分、片段过短的降权、来源优先级高的提前。效果未必惊艳，但比盲目相信单一向量分数更稳。

## 用 LangChain4j 串起来

下面是一个简化后的入库示例，使用 PostgreSQL 的 pgvector 作为向量存储：

```java
EmbeddingStore<TextSegment> store = PgVectorEmbeddingStore.builder()
    .host("localhost")
    .port(5432)
    .database("rag")
    .table("embeddings")
    .dimension(1536)
    .user("postgres")
    .password(System.getenv("PG_PASSWORD"))
    .build();

EmbeddingModel embeddingModel = OpenAiEmbeddingModel.builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("text-embedding-3-small")
    .build();

Document document = FileSystemDocumentLoader.loadDocument(
    Path.of("docs/handbook.md"),
    new TextDocumentParser()
);

EmbeddingStoreIngestor.builder()
    .documentSplitter(DocumentSplitters.recursive(500, 80))
    .embeddingModel(embeddingModel)
    .embeddingStore(store)
    .build()
    .ingest(document);
```

查询侧则可以通过 `EmbeddingStoreContentRetriever` 组合到 `AiServices` 里，让模型在回答前自动完成检索。

真正需要注意的，是**把检索结果注入提示词时，明确告诉模型如何使用它们**。例如：

- 只依据提供的片段回答；
- 如果片段中没有答案，明确说不知道；
- 回答末尾列出引用的来源。

这些约束看起来朴素，却能显著降低幻觉。

## 如何判断它真的变好了

RAG 的评估不能只看「回答像不像」。更可靠的方式，是分别评估检索和生成：

- **检索命中率**：正确答案所在的片段，是否出现在召回结果里？
- **答案正确性**：在给定片段的前提下，回答是否准确？
- **引用准确性**：回答引用的来源，是否真的支持该结论？

准备一组真实问题，人工标注对应片段，比不断调整提示词更有价值。如果没有评估集，调优很容易变成「感觉好像好了」。

## 最后

RAG 不是一个模型问题，而是一个信息组织问题。

模型会越来越强，但「找到正确的上下文」这件事不会自动消失。把文档整理好、把检索做扎实、把引用说清楚，可能比换一个更大的模型更能提升用户体验。

如果你也在做类似的事情，希望这篇整理能帮你少走一点弯路。
