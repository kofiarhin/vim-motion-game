// 30+ curated long passages (60–120 words each)
// Topics: programming, productivity, Vim navigation, MERN stack, learning mindset

const passages = [
  `In Vim, the hjkl keys are used for navigation. Practicing these movements builds muscle memory and allows you to edit without leaving the home row. Combining motions with operators like d and y creates powerful editing shortcuts that can replace the mouse entirely. The more you lean into motions, the less you scroll aimlessly or drag selections. Over time, your attention shifts from the tool to the text itself, and you begin to move with intent. That confidence compounds, and your workflow becomes calm, deliberate, and fast.`,

  `Great engineering is not only about clever solutions; it is about making good decisions under constraints. You rarely have perfect information, unlimited time, or infinite budget. The craft is to choose clear defaults, to keep code comprehensible, and to leave a trail that others can follow. Small, reversible steps usually beat sweeping rewrites. Tests act like guardrails, guiding you to refactor safely. When you optimize for understanding, you optimize for speed over the long arc of a project.`,

  `When you learn a new editor, friction is natural. Your hands hesitate, your eyes search menus, and you get frustrated. But discomfort is a signal that your skills are stretching. Set a weekly goal, practice deliberately, and track the specific stumbling blocks you encounter. Replace a single habit at a time, like moving by words with w and b. Celebrate little wins. After a month of consistent effort, you will realize that the once awkward motions have become effortless.`,

  `The MERN stack blends MongoDB, Express, React, and Node into a cohesive development experience. You model data schematically, expose routes through a thin API, render interactive interfaces, and share JavaScript across the boundary. The benefit is conceptual continuity: one language, one set of tools, many layers. The cost is responsibility; you must design clean boundaries and guard against tight coupling. When each layer is small and focused, changes are quick and predictable.`,

  `Typing accuracy improves with mindful practice. Rather than speeding blindly, aim for clean keystrokes and controlled breathing. A steady rhythm helps you anticipate the next character before your fingers move. If you mistype, pause, correct, and continue without judgment. That feedback loop rewires your habits more effectively than racing the clock. Over days and weeks, your baseline accuracy rises, and speed follows naturally.`,

  `Good commit messages tell a story. They describe intent, not just mechanics, so reviewers understand the why behind the change. A concise subject, a bit of context, and a clear outcome help future readers navigate history. When you link a change to a user problem, you create empathy and accountability. Small, focused commits make reverts painless and reduce the chance of hidden coupling. Your teammates will thank you, and so will your future self.`,

  `Productivity is less about doing more and more about deciding better. Lists get long, energy gets low, and context switches drain attention. Choose the one task that would make the next set of tasks easier or unnecessary. Protect that block of time. Close extra tabs, mute notifications, and make your environment boring. The quiet you create is the amplifier for deep work. Progress accelerates when you stop negotiating with yourself every ten minutes.`,

  `Editing text efficiently is about precision. Motions like f, t, w, and b let you land exactly where you intend, while counts multiply your reach. Operators like d, c, and y act on those motions, composing powerful commands. With practice, you see edits as transformations rather than ad hoc fixes. That mental model reduces friction, because you spend less time deciding and more time executing the shape of the change in your head.`,

  `A resilient codebase favors clarity over cleverness. Use descriptive names, limit global state, and keep functions small. Choose data structures that match the problem. Avoid premature abstraction; duplication is cheaper than the wrong abstraction early on. When you extract a utility, preserve a single responsibility and fit it to tests. Performance work lands best after measuring bottlenecks, not before. These habits help teams move confidently over time.`,

  `React encourages thinking in components. Each unit manages state, renders UI, and communicates through props. When you split a feature, ask what data it owns and what contracts it exposes. Local state is easier to reason about than sprawling context. Co-locating styles and logic builds cohesion and reduces surprise. The best components feel a bit boring because they are predictable, readable, and easy to test.`,

  `Deliberate practice beats passive reading. Write small programs to explore an API, trace execution with a debugger, and explain what you discovered out loud. Teaching sharpens your mental model because you must name each moving part. When you stumble, identify the smallest reproduction, fix it, and record the lesson. Over time, these micro-loops compound into intuition, and tasks that felt intimidating become approachable and even fun.`,

  `Vim’s normal mode separates thinking from typing. You decide what to change and then execute the command, rather than interleaving motion and insertion unconsciously. That separation reduces accidental edits and encourages composability. Start with the basics: h and l to move, w and b for words, and d or c to delete or change. Add one new motion per week. Your efficiency improves because you hesitate less and recover faster from mistakes.`,

  `MongoDB’s document model shines when your data shape is flexible. Embed related fields when you read them together; reference documents when relationships fan out widely. Indexes are worth the time to design and monitor, because slow queries multiply under load. Schema validation, even if minimal, protects you from silent drift. The goal is to balance agility with safety so iteration remains fast without sacrificing correctness.`,

  `Deep work requires a boundary. Decide when you will be offline, and honor that appointment with yourself. Use a timer, set a clear objective, and keep a notepad for ideas that pop up but do not belong. When the session ends, step away, breathe, and capture what you finished. This cadence prevents burnout and builds a reliable rhythm. Quality accumulates when you protect attention with intention every single day.`,

  `Keyboard-driven editing makes your hands the limiting factor, not the pointer. The travel between keyboard and mouse seems small, but the cumulative cost is real. By learning a few commands well, you recover minutes each hour and momentum each day. The goal is not to memorize everything; it is to internalize the 20 percent that you use constantly. That small set delivers the majority of the benefit.`,

  `Express favors explicitness. A route receives a request, performs validation, delegates to a service, and returns a response. Keep middleware linear and avoid magic that hides control flow. When handlers are small and pure, testing becomes straightforward. Error handling belongs near the edge, with clear messages for clients and structured logs for operators. Simplicity at this layer pays dividends in reliability and observability.`,

  `Accuracy is a mindset. When you type, imagine each keystroke as a promise to your future self. Slow down enough to keep promises. Speed comes later as a side effect of consistency. If you drift, pause, reposition, and reset your rhythm. Trust that patience compounds. The disciplines that feel slow today become automatic tomorrow, and they free you to think about the problem rather than the keyboard.`,

  `React hooks simplify stateful logic by encouraging composition. A custom hook can encapsulate timers, event listeners, or derived data, and expose a tiny API to the component. This keeps view code declarative and tidy. When you keep dependencies explicit, effects predictable, and cleanup robust, your components remain resilient under change. The less incidental complexity you carry, the more energy you preserve for real problems.`,

  `Learning to learn changes everything. When you reflect on how you study, you uncover habits worth keeping and others worth replacing. Space repetition cements memory; retrieval practice exposes gaps; interleaving prevents illusions of mastery. Treat your energy like a resource and your attention like a budget. The meta-skill is building systems that work even on average days, not just on perfect ones.`,

  `The best tools fade into the background because they streamline decisions. Keyboard shortcuts, snippet expansions, and lint-on-save remove small frictions that otherwise accumulate into fatigue. You do not need to configure endlessly; you need a stable setup that nudges you toward good defaults. Once you stop fighting your environment, you notice your curiosity returning, and with it, the motivation to build.`,

  `Vim’s text objects unlock semantic editing. Instead of counting characters, you can operate on a word, a sentence, or a paragraph. Commands like ciw or das become precise and expressive once you notice the patterns in your language. The idea is to act on meaning rather than on position. That shift makes complex edits feel gentle, because you manipulate concepts instead of micromanaging cursors.`,

  `In collaborative projects, kindness scales productivity. Reviews that ask questions rather than issue decrees invite discussion. Naming trade-offs explicitly helps everyone learn. When teammates feel safe to expose confusion, the team converges faster on good solutions. Culture is a tool; it either amplifies or undermines your technical choices. Choose to amplify by making excellence and empathy non-negotiable.`,

  `Node’s event loop rewards non-blocking design. Keep CPU-heavy work off the main thread, stream large payloads, and backpressure I/O when you can. Async patterns are easier to manage with small functions that return promises rather than nested callbacks. Observability matters; metrics and trace IDs shorten the path from symptom to cause. Performance is mostly architecture and only sometimes micro-optimizations.`,

  `A meaningful backlog is short. Each ticket states the user problem, the constraints, and a clear definition of done. Defer prioritization for ideas that are not ready. The clarity forces trade-offs and helps avoid scope creep. When you deliver thin vertical slices, value reaches users sooner, and feedback guides the next slice. Iteration becomes the plan rather than a risk to be managed.`,

  `Typing long passages trains endurance and attention. You learn to maintain posture, to relax your shoulders, and to breathe evenly. Errors happen, but you recover without panic. The goal is not a perfect run; it is a smooth one. With time, you notice your eyes scanning further ahead, your hands following calmly, and your mind staying quiet. That feeling is flow, and it is worth practicing for.`,

  `The MERN stack shines for teams who value iteration. You can sketch a schema, scaffold CRUD routes, render a view, and ship in a day. The key is to keep seams between layers clean so each piece can evolve independently. When your boundaries are clear, you can swap a data store, change a cache, or refactor a view without touching every file. Modularity buys freedom.`,

  `Typing discipline transfers to coding discipline. You plan before you type, keep functions small, and name things with care. You return to a problem after a break and pick up the thread quickly because your code reads like prose. That clarity does not slow you down; it accelerates you by reducing backtracking. The less you fight your previous self, the more energy you have for the next idea.`,

  `Vim navigation by words is a superpower. With w you leap to the next start; with b you retreat; with e you land at the end. Combined with counts, you move precisely in fewer keystrokes. Replace frantic arrow pressing with composed motions. Your cursor becomes a tool, not a distraction, and your focus returns to structure and meaning rather than pixels.`,

  `Healthy teams normalize refactoring. You touch a file, you leave it a bit better. Rename a variable, extract a function, or add a missing test. Small improvements add up and prevent rot. When you ship frequently, you reduce the blast radius of mistakes and build trust with stakeholders. Quality becomes a habit rather than a last-minute scramble before a release.`,

  `A learning mindset thrives on curiosity. Ask how a library works under the hood, sketch the data flow, and build a minimal reproduction. When you treat unknowns as puzzles rather than threats, you conserve emotional energy. Progress feels lighter because you trust that you can figure it out. That attitude compounds more than any single trick or syntax.`,

  `Your editor is your instrument. Tune it thoughtfully, but do not chase perfection. Choose a dark theme that reduces eye strain, a readable font, and a few high-leverage plugins. Map shortcuts you will actually use. The best configuration is the one you forget about because it quietly helps you notice the code. Let the tool be quiet so your thinking can be loud.`,
]

export default passages

