## Problem Space
Studying abroad has become very common among students and the United States is a popular location. Students and professionals from all over the globe come here to pursue their higher studies or research. However, one challenge faced by many of these people, and shared by our teammates, is the language barrier. 

Many of these students come from places where English is not the main language. At Johns Hopkins, the majority of these international students come from India and China. Despite these countries' efforts to teach English, the skills students are equipped with are often not enough to prepare them to get the most out of their education if they study abroad.

When these students are then required to give presentations, they may then become stressed out in both preparing and giving the speech. When preparing, they may struggle to know how much to trust online tools to help them communicate their ideas in a natural and engaging way. When giving a speech, they may forget the right words in English at the moment, stuttering as they translate from their mother tongue. 

We recognized that there is potential in this space to create a solution, given how there are many ways we can approach the issue; do we focus on the speech preparation step or when they are actively giving the speech? If we went with the preparation, we could assist them with practicing their speech, or finding the right words in English. If we created a tool to use during the speech, it could be used to give them the next word they are struggling to find to finish a sentence, averting an otherwise uncomfortable moment. 

We want to focus on an app that assists students in their speech preparation step as not in every situation would a student be able to use their phone while they speak; an app that helps for the preparation step may be more useful than an app to help users during the presentation step.
By improving student’s speech prep process, they will become more confident public speakers, making more out of their study abroad experience. 
## Background
At Johns Hopkins University, many international students struggle to practice spoken English in daily academic and social settings. Limited opportunities, anxiety, and lack of personalized feedback hinder improvement. Therefore, we plan to develop an app that lets users input an outline of their speech. Then, the tool will revise the speech for flow and cultural nuances and give them a list of key words to practice pronouncing. While they practice with their revised speech, they can also practice and memorize these terms, so on presentation day they will know the right terms to use, and be confident in delivery.
## Current State
Similar to the questions we posed in the problem space when discussing what aspects of the problem to approach, there have been previous tools created to address some of these issues. Existing tools can be split into the speech preparation step, and the presenting step, and many of them do not specifically target ESL speakers. 

Most of the tools have been addressing the speech preparation issue, such as ELSA Speak, Yoodli, and Orai. ELSA Speak is targeted directly for ESL’s, and they focus on pronunciation, stress, and intonation. Yoodli and Orai focus on pacing, avoiding filler words, and energy levels, and are meant for existing English speakers. 

Relatively recent research has been done by researchers at the National University of Singapore where they published in 2025 a study titled “AI-Based Speaking Assistant: Supporting Non-Native Speakers' Speaking in Real-Time Multilingual Communication”. They created a prototype that provided AI-powered speaking suggestions to non-native English speakers that would adapt their response in Chinese to an appropriate, conversationally relevant one in English. Then, the researchers asked them to use it in a mock scenario to communicate with teammates, and studied how they felt about their communication afterwards. The researchers found that while quantitatively there was not a difference in the speaker’s competence with and without using their tool, qualitative studies showed clarity and strength of their arguments improved. 

Because a team has already created a tool in the space of Human-Centered AI Interaction, we wanted to focus on creating a tool in the speech preparation step. Because ELSA Speak focuses on low-level pronunciation for ESL learners while Yoodli and Orai targets argument generation for native speakers, we want to create a tool that can bridge the gap. We will create an app where non-native english speakers can develop their pronunciation of their speech, while also understanding how to reword their ideas to be more effective while learning new vocabulary. 

## Importance
This project addresses the dual challenge of high cognitive load and social anxiety for second language acquisition. The software is trying to bridge the gap of language by providing real-time, context aware translation. This allows English as a Second Language student (ESL students) to maintain a flow of conversation and focus on interpersonal connection. 
This issue is important in our community. Based on demographics, Johns Hopkins University has 20% of students who speak a language other than English at home (https://apply.jhu.edu/life-at-hopkins/diversity-inclusion-at-hopkins/). Driven by the needs, we want to build a tool that aims to develop a seamless interface that empowers these students to engage in campus life with greater confidence.


## Overview:
Six semi-structured interviews were conducted with international graduate students to understand the communication challenges they face in English-language academic environments. The participants represent different native languages (Telugu/Tamil and Mandarin) and different stages of English proficiency, ranging from a student still actively struggling with real-time comprehension to a near-fluent senior reflecting on barriers they have already overcome. The interviews covered classroom participation, writing tasks, vocabulary retention habits, tool usage, and attitudes toward potential product features.
## Interview Question:
Demographics: Name, Country, First Language
1.Can you describe a specific moment this week where you felt your English held you back?
2.How do you feel right before you have to speak in front of your class — what goes through your mind?
1. When you write an email to a professor, how long does it usually take you, and what makes it hard? 
2. Do you ever write something in your native language first, then try to translate it? How does that go?
3. Is there a word or phrase you keep forgetting in English that you wish would just "stick"? What do you usually do about it?
4. After a class discussion where you didn't understand some words, do you go back and look them up — or do you move on?
5. How much time per day, realistically, would you spend on an app meant to improve your English? 
6. What has made you give up on a language learning tool in the past?
7. Have you ever avoided participating in a class discussion because you weren't confident enough in your English? What was that like?
8.  How important is it to you that your English still "sounds like you" — rather than sounding overly formal or robotic?
9.  What tools do you currently use to help you communicate or improve English?
12.. When you encounter a new English word, what do you usually do? Look it up once and move on, Write it down somewhere, Try to remember it mentally, Use flashcards or vocabulary apps
1.  Do you keep track of vocabulary that you learn or struggle with?
2.  Would it help if an app automatically tracked difficult or new words that you encounter?
3.  What do you think is the biggest problem you face in communication in English — for example, grammar, vocabulary, people speaking too fast, or not feeling confident enough to speak?
4.  If a tool could help you structure your ideas into clear sentences or presentation drafts, would you use it?

## Key Findings: 
Finding 1: Mental translation is the central bottleneck
The most consistently validated finding across all three interviews is that the habit of thinking in one’s native language and translating into English in real time is the primary source of friction. Person 2 describes this explicitly: they think in Chinese, attempt to translate on the fly, and get stuck whenever they encounter something they cannot render in English. Person 3 confirms that breaking this translation habit was the single biggest turning point in their fluency. Even Person 1, who writes comfortably in English, still defaults to thinking in their native language when engaging with new concepts. This suggests that any tool targeting this population should address the translation dependency directly, not just improve vocabulary or grammar in isolation.

Finding 2: Comprehension speed(not production accuracy) is the primary classroom barrier
Person 1 identifies “people speaking too fast” as their biggest challenge. Person 2 reports only catching 70–80% of group discussion. Person 3 experienced the same problem in their early years. The pattern is clear: in fast-paced classroom interactions, the bottleneck is not knowing the right words but processing incoming speech quickly enough to follow the conversation and respond in time. Grammar and vocabulary are secondary to this real-time processing gap.

Finding 3: Passive vocabulary decay is universal, but nobody actively fights it
All three participants encounter unfamiliar words regularly. Person 2 admits to looking words up once and immediately forgetting them. Person 1 wants vocabulary tracking but does not maintain it. Person 3 kept a phrase notebook in their early years but eventually stopped. The consistent pattern is that everyone recognizes the value of retention but finds the cognitive overhead of manual tracking unsustainable alongside graduate coursework. The effort cost, not the lack of awareness, is what prevents sustained vocabulary building.

Finding 4: The confidence gap has social and identity consequences beyond academics
Person 3’s reflection is particularly revealing: they describe having “a full personality” in Chinese but becoming “a much quieter person” in English, with classmates mistaking their language barrier for shyness. Person 2 holds back in group discussions whenever they are not structurally required to lead. Person 1 has not avoided participation but acknowledges difficulty following culturally embedded humor and idiom. The language barrier does not merely reduce academic performance—it flattens students’ social identities, making them appear less capable or engaged than they actually are.

Finding 5: Existing tools fail because they feel like studying
Person 3 states directly that the moment an app feels like homework, they abandon it. Person 2 dropped their TOEFL vocabulary app as soon as exam pressure disappeared. Person 1 gravitates toward game-like formats such as Wordle and NYT crosswords. The through-line is that extrinsic motivation (test preparation, streak counts) does not sustain engagement, and anything that frames itself as deliberate study gets abandoned once the external pressure is removed. Tools that survived were those that felt like entertainment or were embedded in daily life (Netflix, casual word games).

Finding 6: “Natural” phrasing matters more than “correct” phrasing
Both Person 2 and Person 3 independently distinguish between grammatically correct English and English that sounds like how a native speaker actually talks. Person 3 describes spending a long time sounding overly formal because they were translating textbook-style Chinese. Person 2 explicitly requests a tool that shows how a native speaker would phrase something, not just one that fixes grammar. This gap between correctness and naturalness is the one that existing tools fail to address, and it represents a clear differentiator for a new product.


## Insights
Insight 1: The tool should target the first-year-to-second-year window
Person 3’s experience demonstrates that the immersion environment eventually resolves most barriers, but the first one to two years are where students suffer most and where intervention has the highest benefits. Person 2 is currently in this window and represents the core user. Person 1 stays in the middle, basic language functional but still encountering gaps. Designing for students who are still mentally translating, still losing portions of classroom speech, and still holding back from participation will capture the population with the greatest unmet need.

Insight 2: Automatic tracking must surface patterns, not just lists
Person 2 and Person 1 both express interest in automatic vocabulary tracking. But Person 3 adds the critical nuance: the hardest part is not learning a word once but realizing you keep forgetting the same words repeatedly. A tracking feature that merely logs encountered words would replicate the flashcard model that users have already abandoned. The value lies in detecting recurring gaps and resurfacing words at strategically timed intervals, essentially spaced repetition, but with zero manual setup required from the user.

Insight 3: Gamification must be intrinsically engaging, not extrinsically motivating
Person 1 prefers gamified features and specifically mentions crosswords and Duolingo-style mechanics. However, Person 3’s warning about apps feeling like homework, combined with Person 2’s abandonment of vocabulary apps post-TOEFL, suggests that streaks, points, and leaderboards alone will not sustain engagement. The gamification model should lean toward puzzle-based, discovery-oriented interactions, similar to NYT Games than Duolingo. In this situation, the activity itself is rewarding rather than a wrapper around rote memorization.

Insight 4: The “natural phrasing” feature is the strongest differentiator
No existing tool that participants referenced handles the gap between correct English and natural English well. Both Person 2 and Person 3 independently identified this as the most valuable potential feature: a tool that takes a rough idea and shows how a native speaker would phrase it in different situations (casual discussion, professor email, class presentation). This maps directly onto real pain points and fills a gap that grammar checkers and vocabulary apps do not address.

Insight 5: Listening comprehension is underserved and high-impact
Person 2 identifies listening as where they lose confidence most. Person 1’s biggest challenge is speech speed. The majority of language tools focus on production (writing, speaking output), but for classroom participation, speed understanding of listening is the prerequisite. A feature that trains fast listening, perhaps through progressively faster audio of academic-style speech, would address an issue that most competitors avoid.

## Design Goals:
1, Reduce the cognitive cost of vocabulary retention to near zero
Automatic tracking, intelligent remembering mechanism through spaced repetition, and zero manual track. The user should never have to organize their own word lists.

2. Help students bridge the gap between correct and natural English
Show users how a native speaker would phrase their intended meaning in context-appropriate situations, rather than simply correcting grammatical errors.

3. Make practice feel like play, not study
Puzzle-based, discovery-oriented interactions that fit into 15–30 minute daily windows and sustain engagement without relying on external pressure or streak mechanics.

4. Lower the emotional barrier to participation
By creating a safe, low-stakes environment for practicing expression that allows students to practice  for class discussions, emails, and presentations before facing real-world pressure.
    
## Constraints:

There are a few constraints that became apparent after the interviews with students as well as points we have to keep in mind during the development process. It's important to note that these constraints are based on the handful of interviews we conducted, so there is no guarantee that these results are applicable for every user. 
Firstly, AI is known for not being 100% accurate and it's very possible that that AI-based system is unable to pick up on certain slang or nuances, as well as it could produce an unnatural way of speaking which poses a problem as the main goal for users is a natural way of speaking.
Secondly, students are already busy and have to manage multiple online systems for their classes and extra curriculars as is. One of the main goals of this system is to decrease cognitive load so if students feel like using this app is extra work/taking up too much of their time to use, then they will be more inclined to not use it. 
Third, like any AI system, there are some relevant privacy concerns because users will be typing snippets of speech they encounter as well as they may mention their location and other personal details when prompting. 
Proposed system
Our system is a mobile app designed for international students who know what they want to say in English but struggle to say it naturally. The system works in two connected parts.
The first part is a speech and writing assistant. The user types or speaks a rough idea in any language or broken English, and the app instantly returns a clean, natural-sounding version in the tone they choose — formal for a professor, casual for a group chat, or academic for a presentation. This directly addresses what almost every interview participant asked for: not grammar correction, but sounding like a real person.
The second part is an automatic vocabulary list builder. Based on the ideas the user inputs, the system will suggest 10-15 words that could help the user better communicate their ideas. For example, if a person wants to discuss Explainable AI with a classmate who only speaks English, the person could describe those concepts in Mandarin, then the system would suggest “local explanations”, “saliency maps” and “contrastive explanations” as words to practice speaking naturally and learning. After the system confirms whether the user wants to practice with those words, it will then turn the approved list into flashcards, short quizzes, and daily review reminders. Users can see their progress in memorizing those words over time through a dashboard showing words learned, quiz scores, and streaks.
The two parts work together — every time a user drafts something, they are also building their vocabulary without extra effort. This design directly responds to the research finding that users want improvement to happen passively, not feel like extra homework.
