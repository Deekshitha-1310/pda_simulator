const { useState, useEffect, useRef } = React;

        // PDA Definitions
        const PDAS = [
            {
                name: "L = {0\u207f1\u207f | n\u22651} → DPDA",
                type: "DPDA",
                states: ["q0", "q1", "q2"],
                startState: "q0",
                acceptStates: ["q2"],
                inputAlphabet: ["0", "1"],
                stackAlphabet: ["Z0", "0"],
                initialStack: "Z0",
                acceptCondition: "Accept when: (1) Final state q2 is reached, (2) Input string is fully consumed, AND (3) Stack contains only the initial stack symbol Z0",
                transitions: [
                    { from: "q0", inp: "0", top: "Z0", to: "q0", push: "0Z0", desc: "\u03b4(q0, 0, Z0) = (q0, 0Z0) - Push 0" },
                    { from: "q0", inp: "0", top: "0", to: "q0", push: "00", desc: "\u03b4(q0, 0, 0) = (q0, 00) - Push 0" },
                    { from: "q0", inp: "1", top: "0", to: "q1", push: "\u03b5", desc: "\u03b4(q0, 1, 0) = (q1, \u03b5) - First 1, pop 0, go to q1" },
                    { from: "q1", inp: "1", top: "0", to: "q1", push: "\u03b5", desc: "\u03b4(q1, 1, 0) = (q1, \u03b5) - Pop 0 for each 1" },
                    { from: "q1", inp: "epsilon", top: "Z0", to: "q2", push: "Z0", desc: "\u03b4(q1, \u03b5, Z0) = (q2, Z0) - Keep Z0, go to accept" }
                ],
                formal: [
                    "Q = {q0, q1, q2}",
                    "\u03a3 = {0, 1}",
                    "\u0393 = {Z0, 0}",
                    "q0 = q0",
                    "Z0 = Z0",
                    "F = {q2}",
                    "Accept: q2 AND stack = [Z0]"
                ],
                concept: "Logic: Push 0 for each 0, pop 0 for each 1. If 0 appears after 1 → REJECT. Accept if final state reached with empty stack (only Z0 remains).",
                exampleTrace: "Input: 0011\nStep 1: Read 0, push 0 → Stack: [Z0, 0], State: q0\nStep 2: Read 0, push 0 → Stack: [Z0, 0, 0], State: q0\nStep 3: Read 1, pop 0 → Stack: [Z0, 0], State: q1\nStep 4: Read 1, pop 0 → Stack: [Z0], State: q1\nStep 5: ε-transition → Stack: [Z0], State: q2 (ACCEPT)"
            },
            {
                name: "Balanced Parentheses → DPDA",
                type: "DPDA",
                states: ["q0", "qf"],
                startState: "q0",
                acceptStates: ["qf"],
                inputAlphabet: ["(", ")"],
                stackAlphabet: ["Z", "("],
                initialStack: "Z",
                acceptCondition: "Accept when: (1) Final state qf is reached, (2) Input string is fully consumed, AND (3) Stack contains only the initial stack symbol Z",
                transitions: [
                    { from: "q0", inp: "(", top: "Z", to: "q0", push: "(Z", desc: "\u03b4(q0, (, Z) = (q0, (Z) - Push (" },
                    { from: "q0", inp: "(", top: "(", to: "q0", push: "((", desc: "\u03b4(q0, (, () = (q0, (() - Push (" },
                    { from: "q0", inp: ")", top: "(", to: "q0", push: "\u03b5", desc: "\u03b4(q0, ), () = (q0, \u03b5) - Pop (" },
                    { from: "q0", inp: "epsilon", top: "Z", to: "qf", push: "Z", desc: "\u03b4(q0, \u03b5, Z) = (qf, Z) - Stack empty, accept" }
                ],
                formal: [
                    "Q = {q0, qf}",
                    "\u03a3 = {(, )}",
                    "\u0393 = {Z, (}",
                    "q0 = q0",
                    "Z = Z",
                    "F = {qf}",
                    "Accept: qf AND stack = [Z]"
                ],
                concept: "Logic: Push ( for each '('. Pop ( for each ')'. If trying to pop when stack empty (only Z) → REJECT. Accept if balanced and final state reached.",
                exampleTrace: "Input: (())\nStep 1: Read (, push ( → Stack: [Z, (], State: q0\nStep 2: Read (, push ( → Stack: [Z, (, (], State: q0\nStep 3: Read ), pop ( → Stack: [Z, (], State: q0\nStep 4: Read ), pop ( → Stack: [Z], State: q0\nStep 5: ε-transition → Stack: [Z], State: qf (ACCEPT)"
            },
            {
                name: "L = {a\u1d50b\u207f c\u207f d\u1d50 | m,n \u2265 1} → DPDA",
                type: "DPDA",
                states: ["q\u2080", "q\u2081", "q\u2082", "q\u2083", "q_f"],
                startState: "q\u2080",
                acceptStates: ["q_f"],
                inputAlphabet: ["a", "b", "c", "d"],
                stackAlphabet: ["Z", "A", "B"],
                initialStack: "Z",
                acceptCondition: "Accept when: (1) Final state q_f is reached, (2) Input string is fully consumed, AND (3) Stack contains only the initial stack symbol Z",
                transitions: [
                    // 1. a-phase (push A)
                    { from: "q\u2080", inp: "a", top: "Z", to: "q\u2080", push: "AZ", desc: "\u03b4(q\u2080, a, Z) \u2192 (q\u2080, AZ) - Push A" },
                    { from: "q\u2080", inp: "a", top: "A", to: "q\u2080", push: "AA", desc: "\u03b4(q\u2080, a, A) \u2192 (q\u2080, AA) - Push A" },
                    // 2. Move to b-phase
                    { from: "q\u2080", inp: "b", top: "Z", to: "q\u2081", push: "BZ", desc: "\u03b4(q\u2080, b, Z) \u2192 (q\u2081, BZ) - Switch to b-phase" },
                    { from: "q\u2080", inp: "b", top: "A", to: "q\u2081", push: "BA", desc: "\u03b4(q\u2080, b, A) \u2192 (q\u2081, BA) - Switch to b-phase" },
                    // 3. b-phase (push B)
                    { from: "q\u2081", inp: "b", top: "B", to: "q\u2081", push: "BB", desc: "\u03b4(q\u2081, b, B) \u2192 (q\u2081, BB) - Push B" },
                    { from: "q\u2081", inp: "b", top: "A", to: "q\u2081", push: "BA", desc: "\u03b4(q\u2081, b, A) \u2192 (q\u2081, BA) - Push B" },
                    // 4. Move to c-phase (pop B)
                    { from: "q\u2081", inp: "c", top: "B", to: "q\u2082", push: "\u03b5", desc: "\u03b4(q\u2081, c, B) \u2192 (q\u2082, \u03b5) - Switch to c-phase, pop B" },
                    // 5. c-phase (pop B)
                    { from: "q\u2082", inp: "c", top: "B", to: "q\u2082", push: "\u03b5", desc: "\u03b4(q\u2082, c, B) \u2192 (q\u2082, \u03b5) - Pop B" },
                    // 6. Move to d-phase (pop A)
                    { from: "q\u2082", inp: "d", top: "A", to: "q\u2083", push: "\u03b5", desc: "\u03b4(q\u2082, d, A) \u2192 (q\u2083, \u03b5) - Switch to d-phase, pop A" },
                    // 7. d-phase (pop A)
                    { from: "q\u2083", inp: "d", top: "A", to: "q\u2083", push: "\u03b5", desc: "\u03b4(q\u2083, d, A) \u2192 (q\u2083, \u03b5) - Pop A" },
                    // 8. Accept
                    { from: "q\u2083", inp: "epsilon", top: "Z", to: "q_f", push: "Z", desc: "\u03b4(q\u2083, \u03b5, Z) \u2192 (q_f, Z) - Accept" }
                ],
                formal: [
                    "Q = {q\u2080, q\u2081, q\u2082, q\u2083, q_f}",
                    "\u03a3 = {a, b, c, d}",
                    "\u0393 = {Z, A, B}",
                    "q\u2080 = q\u2080",
                    "Z = Z",
                    "F = {q_f}",
                    "Accept: q_f AND stack = [Z]"
                ],
                concept: "6-State DPDA: q\u2080=a-phase (push A), q\u2081=b-phase (push B), q\u2082=c-phase (pop B), q\u2083=d-phase (pop A), q_f=accept. Stack tracks a's (A) to match d's, b's (B) to match c's. Strict order a\u2192b\u2192c\u2192d enforced. Accept when input finished and stack returns to Z.",
                exampleTrace: "Input: aabbccdd (m=2, n=2)\nStep 1: Read a, push A \u2192 Stack: [Z, A], State: q_a\nStep 2: Read a, push A \u2192 Stack: [Z, A, A], State: q_a\nStep 3: Read b, push B \u2192 Stack: [Z, A, A, B], State: q_b\nStep 4: Read b, push B \u2192 Stack: [Z, A, A, B, B], State: q_b\nStep 5: Read c, pop B \u2192 Stack: [Z, A, A, B], State: q_c\nStep 6: Read c, pop B \u2192 Stack: [Z, A, A], State: q_c\nStep 7: Read d, pop A \u2192 Stack: [Z, A], State: q_d\nStep 8: Read d, pop A \u2192 Stack: [Z], State: q_d\nStep 9: \u03b5-transition \u2192 Stack: [Z], State: q_accept (ACCEPT)"
            },
 {
    name: "L = {wwʳ | w ∈ {a,b}*} — Even Palindromes → NPDA",
    type: "NPDA",
    states: ["q0", "q1", "qf"],
    startState: "q0",
    acceptStates: ["qf"],
    inputAlphabet: ["a", "b"],
    stackAlphabet: ["Z0", "a", "b"],
    initialStack: "Z0",
    acceptCondition: "Accept when there exists at least one computation path that: (1) Reaches final state qf, (2) Fully consumes the input string, AND (3) Returns stack to only Z0",
    transitions: [
        { from: "q0", inp: "a", top: "Z0", to: "q0", push: "aZ0", desc: "Push a" },
        { from: "q0", inp: "a", top: "a", to: "q0", push: "aa", desc: "Push a" },
        { from: "q0", inp: "a", top: "b", to: "q0", push: "ab", desc: "Push a" },

        { from: "q0", inp: "b", top: "Z0", to: "q0", push: "bZ0", desc: "Push b" },
        { from: "q0", inp: "b", top: "a", to: "q0", push: "ba", desc: "Push b" },
        { from: "q0", inp: "b", top: "b", to: "q0", push: "bb", desc: "Push b" },

        { from: "q0", inp: "epsilon", top: "Z0", to: "q1", push: "Z0", desc: "Guess middle" },
        { from: "q0", inp: "epsilon", top: "a", to: "q1", push: "a", desc: "Guess middle" },
        { from: "q0", inp: "epsilon", top: "b", to: "q1", push: "b", desc: "Guess middle" },

        { from: "q1", inp: "a", top: "a", to: "q1", push: "ε", desc: "Match a" },
        { from: "q1", inp: "b", top: "b", to: "q1", push: "ε", desc: "Match b" },

        { from: "q1", inp: "epsilon", top: "Z0", to: "qf", push: "Z0", desc: "Accept" }
    ],
    formal: [
        "Q = {q0, q1, qf}",
        "Σ = {a, b}",
        "Γ = {Z0, a, b}",
        "Start = q0",
        "Z0 = Z0",
        "F = {qf}",
        "Accept: qf AND input consumed AND stack = [Z0]"
    ],
    concept: "Push symbols in q0, nondeterministically guess the middle, then strictly match and pop in q1. Accept only if the entire input is consumed and stack returns to Z0. Uses BFS (Breadth-First Search) to explore all computation paths simultaneously, ensuring the shortest accepting path is found if one exists.",
    exampleTrace: "Input: abba\nq0: push a → push b\nε move to q1\nq1: match b → match a\nε → qf (ACCEPT)"
}
        ];

        // State
        let currentLang = 0;
        let simSteps = [];
        let simIdx = -1;
        let autoTimer = null;

        // Helper functions
        function parsePushStr(str) {
            const arr = [];
            let i = 0;
            while (i < str.length) {
                if (str[i] === "Z" && (str[i + 1] === "\u2080" || str[i + 1] === "0")) {
                    arr.push("Z0");
                    i += 2;
                } else {
                    arr.push(str[i]);
                    i++;
                }
            }
            return arr;
        }

        function applyTransition(stack, trans) {
            const ns = [...stack];
            const prevTop = ns[ns.length - 1];
            
            if (trans.push === "" || trans.push === "\u03b5") {
                ns.pop();
                return { ns, op: "pop" };
            }
            
            // Check if push symbol is the same as the top symbol (no-op)
            if (trans.push === prevTop) {
                return { ns, op: "noop" };
            }
            
            // Generic: pop top, then push symbols RIGHT-TO-LEFT so leftmost ends on top
            ns.pop();
            const syms = parsePushStr(trans.push);
            for (let i = syms.length - 1; i >= 0; i--) {
                ns.push(syms[i]);
            }
            return { ns, op: "push" };
        }

        function findTrans(pda, state, inp, stack) {
            const top = stack[stack.length - 1];
            const out = [];
            
            // First try exact input matches
            for (const t of pda.transitions) {
                if (t.from === state && t.inp === inp && (t.top === top || t.top === "*")) {
                    out.push(t);
                }
            }
            
            // Then try epsilon moves
            for (const t of pda.transitions) {
                if (t.from === state && (t.inp === "\u03b5" || t.inp === "epsilon") && (t.top === top || t.top === "*")) {
                    out.push(t);
                }
            }
            
            return out;
        }

        // Simulation functions
        function simulateDPDA(pda, input) {
            const steps = [];
            let state = pda.startState;
            let stack = [pda.initialStack];
            let pos = 0;
            
            steps.push({
                state,
                remaining: input,
                stack: [...stack],
                position: 0,
                currentSymbol: input[0] || null,
                op: "noop",
                desc: "Initial configuration \u2013 PDA starts",
                transition: "",
                branches: null
            });

            for (let g = 0; g < 300; g++) {
                const inp = pos < input.length ? input[pos] : "\u03b5";
                const stackTop = stack[stack.length - 1];
                
                // CRITICAL: Prevent invalid pop when ) and stack top is Z
                if (inp === ")" && stackTop === "Z") {
                    steps.push({
                        state,
                        remaining: input.slice(pos),
                        stack: [...stack],
                        position: pos,
                        currentSymbol: pos < input.length ? input[pos] : null,
                        op: "reject",
                        desc: "REJECT: Invalid pop - cannot pop from stack bottom Z",
                        transition: "",
                        branches: null,
                        isAccepted: false
                    });
                    break;
                }
                
                // CRITICAL: When input is empty, check for ε-transitions FIRST
                if (pos >= input.length) {
                    const epsilonMatches = findTrans(pda, state, "\u03b5", stack);
                    if (epsilonMatches.length > 0) {
                        // Apply ε-transition instead of rejecting
                        const et = epsilonMatches[0];
                        
                        // Apply epsilon transition
                        let op = "noop";
                        if (et.push === "" || et.push === "\u03b5") {
                            stack.pop();
                            op = "pop";
                        } else if (et.push && et.push !== "Z0" && et.push !== "SAME") {
                            stack.pop();
                            const toPush = parsePushStr(et.push);
                            for (let i = toPush.length - 1; i >= 0; i--) {
                                stack.push(toPush[i]);
                            }
                            op = "push";
                        }
                        state = et.to;
                        
                        steps.push({
                            state,
                            remaining: input.slice(pos),
                            stack: [...stack],
                            position: pos,
                            currentSymbol: null,
                            op,
                            desc: et.desc,
                            transition: `\u03b4(${et.from}, \u03b5, ${et.top}) \u2192 (${et.to}, ${et.push || "\u03b5"})`,
                            branches: null
                        });
                        
                        // Check if now in accept state
                        if (pda.acceptStates.includes(state)) {
                            steps.push({
                                state,
                                remaining: "",
                                stack: [...stack],
                                position: input.length,
                                currentSymbol: null,
                                op: "accept",
                                desc: "ACCEPTED! Final state reached via ε-transition.",
                                transition: "Final acceptance",
                                branches: null,
                                isAccepted: true
                            });
                            break;
                        }
                        continue; // Check for more ε-transitions
                    }
                }
                
                const matches = findTrans(pda, state, inp, stack);
                
                // GLOBAL RULE: If no valid transition exists, immediately REJECT
                if (!matches.length) {
                    steps.push({
                        state,
                        remaining: input.slice(pos),
                        stack: [...stack],
                        position: pos,
                        currentSymbol: pos < input.length ? input[pos] : null,
                        op: "reject",
                        desc: "REJECT: No valid transition exists - No computation path found for current configuration",
                        transition: "",
                        branches: null,
                        isAccepted: false
                    });
                    break;
                }
                
                const t = matches[0];
                
                // GLOBAL RULE: Check for stack underflow BEFORE applying transition
                if (t.top !== "*" && stack[stack.length - 1] !== t.top) {
                    steps.push({
                        state,
                        remaining: input.slice(pos),
                        stack: [...stack],
                        position: pos,
                        currentSymbol: pos < input.length ? input[pos] : null,
                        op: "reject",
                        desc: "REJECT: Stack underflow - required " + t.top + " but found " + (stack[stack.length - 1] || "empty"),
                        transition: "",
                        branches: null,
                        isAccepted: false
                    });
                    break;
                }
                
                // GLOBAL RULE: Check for invalid pop operation (pop when stack top is Z0)
                if ((t.push === "" || t.push === "\u03b5") && stack[stack.length - 1] === pda.initialStack && t.top === pda.initialStack) {
                    steps.push({
                        state,
                        remaining: input.slice(pos),
                        stack: [...stack],
                        position: pos,
                        currentSymbol: pos < input.length ? input[pos] : null,
                        op: "reject", 
                        desc: "REJECT: Cannot pop from stack bottom Z0",
                        transition: "",
                        branches: null,
                        isAccepted: false
                    });
                    break;
                }
                
                const { ns, op } = applyTransition(stack, t);
                stack = ns;
                
                // Only advance position for non-epsilon transitions
                if (t.inp !== "\u03b5") pos++;
                state = t.to;
                
                steps.push({
                    state,
                    remaining: input.slice(pos),
                    stack: [...stack],
                    position: pos,
                    currentSymbol: pos < input.length ? input[pos] : null,
                    op,
                    desc: t.desc,
                    transition: `\u03b4(${t.from}, ${t.inp || "\u03b5"}, ${t.top}) \u2192 (${t.to}, ${t.push || "\u03b5"})`,
                    branches: null
                });
                
                // CRITICAL: Prevent over-accepting - if stack is Z0 but input remains, REJECT
                if (stack.length === 1 && stack[0] === pda.initialStack && pos < input.length) {
                    steps.push({
                        state,
                        remaining: input.slice(pos),
                        stack: [...stack],
                        position: pos,
                        currentSymbol: pos < input.length ? input[pos] : null,
                        op: "reject",
                        desc: `REJECT: Stack has only ${pda.initialStack} but input still has ${input.length - pos} symbol(s) remaining. Cannot process more input with empty stack.`,
                        transition: "",
                        branches: null,
                        isAccepted: false
                    });
                    break;
                }
                
                // STRICT: Do NOT allow epsilon transitions during input processing
                if (inp === "\u03b5" && pos < input.length) {
                    steps.push({
                        state,
                        remaining: input.slice(pos),
                        stack: [...stack],
                        position: pos,
                        currentSymbol: pos < input.length ? input[pos] : null,
                        op: "reject",
                        desc: "REJECT: Epsilon transition not allowed during input processing",
                        transition: "",
                        branches: null,
                        isAccepted: false
                    });
                    break;
                }
                
                // Break conditions
                if (pda.acceptStates.includes(state) && pos >= input.length) {
                    // Add final ACCEPT step
                    steps.push({
                        state,
                        remaining: input.slice(pos),
                        stack: [...stack],
                        position: pos,
                        currentSymbol: null,
                        op: "accept",
                        desc: "ACCEPTED! Input string is valid for this language.",
                        transition: "Final state reached",
                        branches: null,
                        isAccepted: true
                    });
                    break;
                }
                if (stack.length === 0) {
                    // Add final REJECT step - empty stack
                    steps.push({
                        state,
                        remaining: input.slice(pos),
                        stack: [],
                        position: pos,
                        currentSymbol: pos < input.length ? input[pos] : null,
                        op: "reject",
                        desc: "REJECTED! Stack is empty but input remains.",
                        transition: "",
                        branches: null,
                        isAccepted: false
                    });
                    break;
                }
            }
            
            // If loop ended without accept/reject, determine final status
            if (steps.length > 0 && !steps[steps.length - 1].isAccepted && steps[steps.length - 1].op !== "reject") {
                const lastStep = steps[steps.length - 1];
                const isInAcceptState = pda.acceptStates.includes(lastStep.state);
                const isInputConsumed = lastStep.remaining === "" || lastStep.remaining === undefined;
                const hasOnlyInitialStack = lastStep.stack.length === 1 && lastStep.stack[0] === pda.initialStack;
                
                if (isInAcceptState && isInputConsumed && hasOnlyInitialStack) {
                    steps.push({
                        state: lastStep.state,
                        remaining: "",
                        stack: [...lastStep.stack],
                        position: input.length,
                        currentSymbol: null,
                        op: "accept",
                        desc: "ACCEPTED! Input string is valid for this language. Final state reached with only " + pda.initialStack + " on stack.",
                        transition: "Final acceptance",
                        branches: null,
                        isAccepted: true
                    });
                } else {
                    let rejectReason = "";
                    if (!isInAcceptState) rejectReason = "Not in accept state.";
                    else if (!isInputConsumed) rejectReason = "Input not fully consumed.";
                    else if (!hasOnlyInitialStack) rejectReason = "Stack not empty (has extra symbols beyond " + pda.initialStack + ").";
                    
                    steps.push({
                        state: lastStep.state,
                        remaining: lastStep.remaining,
                        stack: [...lastStep.stack],
                        position: lastStep.position,
                        currentSymbol: lastStep.currentSymbol,
                        op: "reject",
                        desc: "REJECTED! " + rejectReason + " - No accepting computation path found",
                        transition: "",
                        branches: null,
                        isAccepted: false
                    });
                }
            }
            
            return steps;
        }

        // ─── NPDA BFS Simulation ──────────────────────────────────────────────────
       function simulateNPDA(pda, input) {
    if (input.length === 0) {
        return [{
            state: "qf",
            remaining: "",
            stack: [pda.initialStack],
            position: 0,
            currentSymbol: null,
            op: "accept",
            desc: "ACCEPTED",
            transition: "ε-transitions",
            isAccepted: true
        }];
    }

    const word = input.split('');
    const allConfigs = [];
    const visited = new Set();

    const initCfg = {
        state: pda.startState,
        idx: 0,
        stack: [pda.initialStack],
        parentIdx: null,
        op: 'noop',
        transition: 'Start',
        remaining: input,
        position: 0,
        currentSymbol: word[0] || null
    };

    allConfigs.push(initCfg);
    let acceptedIdx = null;
    let queue = [0];

    for (let iter = 0; iter < 10000 && queue.length > 0; iter++) {
        const cfgIdx = queue.shift();
        const cfg = allConfigs[cfgIdx];
        const { state, idx, stack } = cfg;

        const inputChar = idx < word.length ? word[idx] : null;
        const stackTop = stack[stack.length - 1];

        if (
            pda.acceptStates.includes(state) &&
            idx === word.length &&
            stack.length === 1 &&
            stack[0] === pda.initialStack
        ) {
            acceptedIdx = cfgIdx;
            break;
        }

        for (const t of pda.transitions) {
            const isEpsilon = (t.inp === 'epsilon' || t.inp === '\u03b5');

            const inputMatches =
                isEpsilon || (inputChar !== null && t.inp === inputChar);

            if (!inputMatches) continue;

            if (!(t.top === stackTop || t.top === "*")) continue;

            if (
                isEpsilon &&
                state === 'q0' &&
                (idx === 0 || (stack.length === 1 && stack[0] === pda.initialStack))
            ) continue;

            if (
                state === 'q1' &&
                inputChar !== null &&
                stackTop !== inputChar
            ) continue;

            
            let nextStack = [...stack];

            if (t.push === '' || t.push === '\u03b5') {
                if (nextStack.length === 0) continue;
                nextStack.pop();
            } else {
                // Handle symbolic push operations (e.g., "aZ0", "aa", "ab", etc.)
                const prevTop = nextStack[nextStack.length - 1];
                if (t.push !== prevTop) {
                    nextStack.pop();
                    const syms = parsePushStr(t.push);
                    for (let i = syms.length - 1; i >= 0; i--) {
                        nextStack.push(syms[i]);
                    }
                }
            }

            const nextIdx = isEpsilon ? idx : idx + 1;

            const configKey = `${t.to}-${nextIdx}-${nextStack.join(',')}`;

            if (!visited.has(configKey)) {
                visited.add(configKey);

                allConfigs.push({
                    state: t.to,
                    idx: nextIdx,
                    stack: nextStack,
                    parentIdx: cfgIdx,
                    transition: `δ(${t.from}, ${isEpsilon ? 'ε' : t.inp}, ${t.top}) → (${t.to}, ${t.push || 'ε'})`,
                    op:
                        (t.push === '' || t.push === '\u03b5')
                            ? 'pop'
                            : (t.push !== nextStack[nextStack.length - 1])
                                ? 'push'
                                : 'noop',
                    remaining: word.slice(nextIdx).join(''),
                    position: nextIdx,
                    currentSymbol: nextIdx < word.length ? word[nextIdx] : null
                });

                queue.push(allConfigs.length - 1);
            }
        }
    }

    const steps = [];

    if (acceptedIdx !== null) {
        let curr = acceptedIdx;
        while (curr !== null) {
            steps.unshift(allConfigs[curr]);
            curr = allConfigs[curr].parentIdx;
        }

        steps.push({
            state: steps[steps.length - 1].state,
            remaining: "",
            stack: steps[steps.length - 1].stack,
            position: input.length,
            currentSymbol: null,
            op: "accept",
            desc: "ACCEPTED",
            transition: "Final state reached",
            isAccepted: true
        });
    } else {
        steps.push({
            state: "REJECT",
            remaining: input,
            stack: [pda.initialStack],
            position: 0,
            currentSymbol: input[0] || null,
            op: "reject",
            desc: "REJECTED: No accepting computation path found - Input is not a valid even palindrome",
            transition: "No valid path to accepting state qf with input fully consumed and stack returned to Z0",
            isAccepted: false
        });
    }

    return steps;
}
        // ─────────────────────────────────────────────────────────────────────────

        // Cytoscape State Diagram Component
        const CytoscapeDiagram = ({ pda, currentStep, isFinalStep }) => {
            const cyRef = useRef(null);
            const containerRef = useRef(null);
            const prevStateRef = useRef(null);
            const isInitializedRef = useRef(false);
            
            useEffect(() => {
                if (!containerRef.current || isInitializedRef.current || !pda) return;
                
                // Build nodes
                const nodes = pda.states.map((state, index) => ({
                    data: {
                        id: state,
                        label: state,
                        isStart: index === 0,
                        isAccept: pda.acceptStates.includes(state)
                    }
                }));
                
                // Build edges with combined labels
                const edgeMap = {};
                for (const t of pda.transitions) {
                    const key = `${t.from}-${t.to}`;
                    const push = t.push ? t.push : '\u03b5';
                    const label = `${t.inp === 'epsilon' ? '\u03b5' : t.inp},${t.top}/${push}`;
                    if (!edgeMap[key]) edgeMap[key] = [];
                    edgeMap[key].push(label);
                }
                
                const edges = Object.entries(edgeMap).map(([key, labels]) => {
                    const [from, to] = key.split('-');
                    const isActive = currentStep && prevStateRef.current === from && currentStep.state === to;
                    return {
                        data: {
                            id: key,
                            source: from,
                            target: to,
                            label: labels.join(' | '),
                            isActive
                        }
                    };
                });
                
                // Initialize Cytoscape
                const cy = cytoscape({
                    container: containerRef.current,
                    elements: [...nodes, ...edges],
                    style: [
                        {
                            selector: 'node',
                            style: {
                                'width': 70,
                                'height': 70,
                                'background-color': '#f8fafc',
                                'border-width': 3,
                                'border-color': '#94a3b8',
                                'label': 'data(label)',
                                'color': '#1e293b',
                                'font-size': '18px',
                                'font-weight': 'bold',
                                'text-valign': 'center',
                                'text-halign': 'center'
                            }
                        },
                        {
                            selector: 'node[isAccept = "true"]',
                            style: {
                                'border-width': 3,
                                'border-color': '#16a34a'
                            }
                        },
                        {
                            selector: 'node.current',
                            style: {
                                'background-color': '#dcfce7',
                                'border-color': '#16a34a',
                                'border-width': 6,
                                'shadow-blur': 20,
                                'shadow-color': '#16a34a',
                                'shadow-opacity': 1
                            }
                        },
                        {
                            selector: 'edge',
                            style: {
                                'width': 3,
                                'line-color': '#94a3b8',
                                'target-arrow-color': '#94a3b8',
                                'target-arrow-shape': 'triangle',
                                'curve-style': 'unbundled-bezier',
                                'label': 'data(label)',
                                'color': '#64748b',
                                'font-size': '12px',
                                'font-family': 'monospace',
                                'text-background-color': '#ffffff',
                                'text-background-opacity': 0.9,
                                'text-background-padding': '6px',
                                'text-background-shape': 'roundrectangle',
                                'text-margin-y': -12,
                                'text-margin-x': 0,
                                'text-rotation': 'autorotate',
                                'arrow-scale': 1.2
                            }
                        },
                        {
                            selector: 'edge.active',
                            style: {
                                'line-color': '#22c55e',
                                'target-arrow-color': '#22c55e',
                                'source-arrow-color': '#16a34a',
                                'width': 5,
                                'color': '#15803d',
                                'shadow-blur': 15,
                                'shadow-color': '#22c55e',
                                'shadow-opacity': 0.9
                            }
                        },
                        {
                            selector: 'edge[source = target]',
                            style: {
                                'curve-style': 'unbundled-bezier',
                                'control-point-step-size': 60,
                                'control-point-distance': 80,
                                'loop-direction': 'north',
                                'loop-sweep': '45',
                                'width': 3,
                                'line-color': '#94a3b8',
                                'target-arrow-color': '#94a3b8',
                                'target-arrow-shape': 'triangle',
                                'label': 'data(label)',
                                'color': '#64748b',
                                'font-size': '12px',
                                'font-family': 'monospace',
                                'text-background-color': '#ffffff',
                                'text-background-opacity': 0.9,
                                'text-background-padding': '4px',
                                'text-background-shape': 'roundrectangle',
                                'text-margin-y': -15,
                                'arrow-scale': 1.3
                            }
                        },
                        {
                            selector: 'edge.active[source = target]',
                            style: {
                                'curve-style': 'unbundled-bezier',
                                'control-point-step-size': 60,
                                'control-point-distance': 80,
                                'loop-direction': 'north',
                                'loop-sweep': '45',
                                'width': 5,
                                'line-color': '#22c55e',
                                'target-arrow-color': '#22c55e',
                                'target-arrow-shape': 'triangle',
                                'label': 'data(label)',
                                'color': '#15803d',
                                'font-size': '12px',
                                'font-family': 'monospace',
                                'text-background-color': '#ffffff',
                                'text-background-opacity': 0.9,
                                'text-background-padding': '4px',
                                'text-background-shape': 'roundrectangle',
                                'text-margin-y': -15,
                                'arrow-scale': 1.5,
                                'shadow-blur': 15,
                                'shadow-color': '#22c55e',
                                'shadow-opacity': 0.9
                            }
                        }
                    ],
                    layout: {
                        name: 'grid',
                        fit: true,
                        padding: 80,
                        avoidOverlap: true,
                        condense: false,
                        position: function(node) {
                            // Layout positions for different PDA state naming conventions
                            const id = node.id();
                            const layout = {
                                // Standard q0, q1, q2, q3, q4
                                'q0': { row: 0, col: 1 },
                                'q1': { row: 1, col: 0 },
                                'q2': { row: 1, col: 2 },
                                'q3': { row: 2, col: 0 },
                                'q4': { row: 2, col: 1 },
                                // Unicode subscript: q₀, q₁, q₂, q₃
                                'q\u2080': { row: 0, col: 1 },
                                'q\u2081': { row: 1, col: 0 },
                                'q\u2082': { row: 1, col: 2 },
                                'q\u2083': { row: 2, col: 0 },
                                // Underscore format: q_a, q_b, q_c, q_d
                                'q_a': { row: 0, col: 1 },
                                'q_b': { row: 1, col: 0 },
                                'q_c': { row: 1, col: 2 },
                                'q_d': { row: 2, col: 0 },
                                // Palindrome PDA states
                                'q_push': { row: 0, col: 1 },
                                'q_pop': { row: 1, col: 1 },
                                // Accept states
                                'q_accept': { row: 2, col: 1 },
                                'qf': { row: 2, col: 1 },
                                'q_f': { row: 2, col: 1 },
                                // NPDA palindrome: linear top-to-bottom
                                // q0 already mapped to row:0,col:1; q1 to row:1,col:0; qf to row:2,col:1
                            };
                            return layout[id] || { row: 0, col: 0 };
                        },
                        cols: 3,
                        rows: 3
                    },
                    minZoom: 0.3,
                    maxZoom: 3,
                    wheelSensitivity: 0.3
                });
                
                cyRef.current = cy;
                isInitializedRef.current = true;
                
                // Enable user interaction - drag nodes
                cy.on('tap', 'node', function(evt){
                    var node = evt.target;
                    node.grabify();
                });
                
                // Make nodes draggable
                cy.nodes().grabify();
                
                // Enable box selection
                cy.boxSelectionEnabled(true);
                
                return () => {
                    cy.destroy();
                    isInitializedRef.current = false;
                };
            }, [pda]);
            
            useEffect(() => {
                if (!cyRef.current || !currentStep) return;
                
                const cy = cyRef.current;
                
                // Clear previous highlights
                cy.nodes().removeClass('current');
                cy.edges().removeClass('active');
                
                // Highlight current state
                const currentNode = cy.getElementById(currentStep.state);
                if (currentNode) {
                    currentNode.addClass('current');
                }
                
                // Highlight active transition
                if (prevStateRef.current) {
                    const edgeId = `${prevStateRef.current}-${currentStep.state}`;
                    const edge = cy.getElementById(edgeId);
                    if (edge) {
                        edge.addClass('active');
                    }
                }
                
                // Update previous state ref
                prevStateRef.current = currentStep.state;
            }, [currentStep]);
            
            return <div ref={containerRef} id="cy" style={{width: '100%', height: '350px'}} />;
        };

        // Main App Component
        const App = () => {
            const [currentLang, setCurrentLang] = useState(0);
            const [input, setInput] = useState("000111");
            const [simulationSteps, setSimulationSteps] = useState([]);
            const [currentStepIndex, setCurrentStepIndex] = useState(-1);
            const [isAutoPlaying, setIsAutoPlaying] = useState(false);
            
            useEffect(() => {
                if (isAutoPlaying && currentStepIndex < simulationSteps.length - 1) {
                    const timer = setTimeout(() => {
                        setCurrentStepIndex(currentStepIndex + 1);
                    }, 1000);
                    return () => clearTimeout(timer);
                }
            }, [isAutoPlaying, currentStepIndex, simulationSteps.length]);
            
          const simulate = () => {
    const pda = PDAS[currentLang];

    if (pda.type === "NOT-CFL") {
        setSimulationSteps([{
            state: "N/A",
            remaining: input,
            stack: [],
            position: 0,
            currentSymbol: null,
            op: "reject",
            desc: "⚠ NOT POSSIBLE: This language is NOT context-free. Cannot be recognized by any PDA.",
            transition: "Requires Turing Machine",
            branches: null,
            isAccepted: false
        }]);
        setCurrentStepIndex(0);
        setIsAutoPlaying(false);
        return;
    }

    const steps = pda.type === 'NPDA'
        ? simulateNPDA(pda, input)
        : simulateDPDA(pda, input);

    
    if (!steps || steps.length === 0) {
        setSimulationSteps([{
            state: "REJECT",
            remaining: "",
            stack: [],
            position: 0,
            currentSymbol: null,
            op: "reject",
            desc: "❌ REJECTED: No valid computation path found",
            transition: "No accepting configuration reached",
            branches: null,
            isAccepted: false
        }]);
        setCurrentStepIndex(0);
        setIsAutoPlaying(false);
        return;
    }

    setSimulationSteps(steps);
    setCurrentStepIndex(0);
    setIsAutoPlaying(true);
};
            const stepForward = () => {
                if (currentStepIndex < simulationSteps.length - 1) {
                    setCurrentStepIndex(currentStepIndex + 1);
                }
            };
            
            const stepBackward = () => {
                if (currentStepIndex > 0) {
                    setCurrentStepIndex(currentStepIndex - 1);
                }
            };
            
            const reset = () => {
                setCurrentStepIndex(-1);
                setIsAutoPlaying(false);
            };
            
            const currentStep = currentStepIndex >= 0 ? simulationSteps[currentStepIndex] : null;
            const isFinalStep = currentStepIndex >= 0 && currentStepIndex === simulationSteps.length - 1;
            
            return (
                <div className="simulator-container">
                    {/* Main Header */}
                    <div style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        right: '0',
                        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                        backdropFilter: 'blur(20px)',
                        borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
                        padding: '1.5rem 2rem',
                        zIndex: '1000',
                        textAlign: 'center',
                        boxShadow: '0 4px 20px rgba(30, 60, 114, 0.4), 0 2px 10px rgba(42, 82, 152, 0.3)'
                    }}>
                        <h1 style={{margin: '0', fontSize: '2.2rem', fontWeight: '700', color: '#fff', textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', letterSpacing: '0.5px'}}>PDA Simulator</h1>
                    </div>
                    
                    <div className="sidebar" style={{paddingTop: '7.5rem'}}>
                        
                        <div className="language-selector">
                            <h2 style={{color: '#fff', fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'center'}}>Choose a Language</h2>
                            <div className="pda-info" style={{marginBottom: '1rem'}}>
                                <h3>{PDAS[currentLang].name}</h3>
                                <p style={{fontSize: '0.8rem', opacity: 0.8}}>{PDAS[currentLang].type}</p>
                            </div>
                            
                            {PDAS.map((pda, index) => 
                                <button
                                    key={index}
                                    className={`lang-button ${currentLang === index ? 'active' : ''}`}
                                    onClick={() => {
                                        setCurrentLang(index);
                                        // Set default input based on language
                                        const defaultInputs = ["000111", "(())", "aabbccdd", "abba"];
                                        setInput(defaultInputs[index] || "000111");
                                        setCurrentStepIndex(-1);
                                        setSimulationSteps([]);
                                        setIsAutoPlaying(false);
                                    }}
                                >
                                    <div style={{fontWeight: 'medium'}}>{pda.name}</div>
                                    <div style={{fontSize: '0.75rem', opacity: 0.8}}>{pda.type}</div>
                                </button>
                            )}
                        </div>
                        
                        <div className="pda-info">
                            <h3 style={{color: PDAS[currentLang].type === 'NOT-CFL' ? '#f44336' : '#4CAF50'}}>
                                {PDAS[currentLang].type === 'NOT-CFL' ? '⚠ Not Context-Free' : 'PDA Definition'}
                            </h3>
                            <div style={{fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: '1.5'}}>
                                {PDAS[currentLang].formal.map((line, i) => (
                                    <div key={i} style={{marginBottom: '0.25rem'}}>{line}</div>
                                ))}
                            </div>
                            
                            {PDAS[currentLang].acceptCondition && (
                                <div style={{marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(76, 175, 80, 0.2)', borderRadius: '4px'}}>
                                    <strong style={{color: '#4CAF50'}}>Accept Condition:</strong>
                                    <div style={{fontSize: '0.8rem'}}>{PDAS[currentLang].acceptCondition}</div>
                                </div>
                            )}
                        </div>
                        
                        <div className="pda-info" style={{background: 'rgba(33, 150, 243, 0.2)'}}>
                            <h3 style={{color: '#2196F3'}}>Logic & Concept</h3>
                            <p style={{fontSize: '0.85rem', lineHeight: '1.5'}}>{PDAS[currentLang].concept}</p>
                        </div>
                        
                        {PDAS[currentLang].exampleTrace && (
                            <div className="pda-info" style={{background: 'rgba(255, 152, 0, 0.2)'}}>
                                <h3 style={{color: '#FF9800'}}>Example Trace</h3>
                                <div style={{fontFamily: 'monospace', fontSize: '0.75rem', lineHeight: '1.6', whiteSpace: 'pre-line'}}>
                                    {PDAS[currentLang].exampleTrace}
                                </div>
                            </div>
                        )}
                        
                        <div className="transitions">
                            <h4>Transition Function (δ)</h4>
                            {PDAS[currentLang].type !== 'NOT-CFL' ? PDAS[currentLang].transitions.map((t, index) => 
                                <div key={index} className="transition-item">{t.desc}</div>
                            ) : <div style={{color: '#f44336', fontStyle: 'italic'}}>Not applicable - This language is not context-free</div>}
                        </div>
                    </div>
                    
                    <div className="main-content" style={{paddingTop: '4rem'}}>
                        {/* Accept/Reject Status Display - Removed from top, now inline with simulate button */}
                        
                        <div className="control-bar">
                            <div className="input-group">
                                <label>Input String</label>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <button className="btn btn-primary" onClick={simulate}>Simulate</button>
                                {isFinalStep && (
                                    <div style={{marginLeft: '0.5rem', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', background: simulationSteps[simulationSteps.length - 1]?.op === 'accept' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)', color: simulationSteps[simulationSteps.length - 1]?.op === 'accept' ? '#4CAF50' : '#f44336', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                        <span>{simulationSteps[simulationSteps.length - 1]?.op === 'accept' ? '✓ ACCEPTED' : '✗ REJECTED'}</span>
                                        <span style={{fontSize: '0.7rem', opacity: 0.8}}>
                                            {simulationSteps[simulationSteps.length - 1]?.op === 'accept' 
                                                ? 'Valid string for this PDA' 
                                                : 'Invalid string for this PDA'}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="control-buttons">
                                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem'}}>
                                    <span style={{fontSize: '0.9rem', opacity: 0.7}}>
                                        Step {currentStepIndex + 1} of {simulationSteps.length}
                                    </span>
                                </div>
                                <button 
                                    className="btn btn-success" 
                                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                                    disabled={simulationSteps.length === 0}
                                    style={{minWidth: '100px'}}
                                >
                                    {isAutoPlaying ? '⏸ Pause' : '▶ Auto Play'}
                                </button>
                                <button 
                                    className="btn btn-warning" 
                                    onClick={stepBackward}
                                    disabled={currentStepIndex <= 0}
                                    style={{minWidth: '100px'}}
                                >
                                    ◀ Step Back
                                </button>
                                <button 
                                    className="btn btn-warning" 
                                    onClick={stepForward}
                                    disabled={currentStepIndex >= simulationSteps.length - 1}
                                    style={{minWidth: '100px'}}
                                >
                                    Step Forward ▶
                                </button>
                                <button className="btn btn-danger" onClick={reset} style={{minWidth: '80px'}}>Reset</button>
                            </div>
                        </div>
                        
                        <div className="visualization-area">
                            <div className="viz-card state-diagram-container">
                                <h2>State Diagram</h2>
                                <div style={{flex: 1, minHeight: '350px'}}>
                                    <CytoscapeDiagram pda={PDAS[currentLang]} currentStep={currentStep} isFinalStep={isFinalStep} />
                                </div>
                            </div>
                            
                            <div className="viz-card stack-container">
                                <h2>Stack</h2>
                                <div className="stack">
                                    {(currentStep && currentStep.stack.length > 0) 
                                        ? currentStep.stack.map((item, index) => 
                                            <div key={index} className="stack-item">{item}</div>
                                        )
                                        : <div className="stack-item empty">Empty</div>
                                    }
                                </div>
                                
                                <div style={{marginTop: '1rem'}}>
                                    <h3>Current State</h3>
                                    <div 
                                        className="current-state"
                                        style={{fontSize: '1.5rem', marginBottom: '1rem'}}
                                    >
                                        {currentStep ? currentStep.state : 'q0'}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="viz-card tape-container">
                                <h2>Input Tape</h2>
                                <div className="tape">
                                    {input.split('').map((char, i) => 
                                        <span 
                                            key={i}
                                            className={`tape-symbol ${currentStep && i < currentStep.position ? 'read' : ''} ${currentStep && i === currentStep.position ? 'current' : ''}`}
                                        >
                                            {char}
                                        </span>
                                    )}
                                </div>
                                {currentStep && (
                                    <div style={{marginTop: '1rem', textAlign: 'center'}}>
                                        <div style={{fontSize: '1.2rem', fontWeight: 'bold'}}>
                                            Current Position: {currentStep.position} {currentStep.currentSymbol ? `(${currentStep.currentSymbol})` : '(Start)'}
                                        </div>
                                        <div style={{fontSize: '0.9rem', opacity: 0.8}}>
                                            Next to read: {currentStep.remaining[0] || 'End of input'}
                                        </div>
                                        <div style={{fontSize: '0.9rem', opacity: 0.6}}>
                                            Remaining: "{currentStep.remaining}"
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="viz-card steps-container">
                                <h2>Execution Steps</h2>
                                <div className="steps">
                                    {simulationSteps.slice(0, currentStepIndex + 1).map((step, index) => 
                                        <div 
                                            key={index}
                                            className={`step ${index === currentStepIndex ? 'current' : ''} ${index < currentStepIndex ? 'visited' : ''} ${step.op === 'accept' ? 'accepted' : ''} ${step.op === 'reject' ? 'rejected' : ''}`}
                                            style={{
                                                borderLeft: step.op === 'accept' ? '4px solid #4CAF50' : step.op === 'reject' ? '4px solid #f44336' : '4px solid #2196F3',
                                                background: step.op === 'accept' ? 'rgba(76, 175, 80, 0.1)' : step.op === 'reject' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                                display: index > currentStepIndex ? 'none' : 'block'
                                            }}
                                        >
                                            <div style={{fontWeight: '600', display: 'flex', justifyContent: 'space-between'}}>
                                                <span>Step {index + 1}:</span>
                                                {step.op === 'accept' && <span style={{color: '#4CAF50', fontWeight: 'bold'}}>✓ ACCEPTED</span>}
                                                {step.op === 'reject' && <span style={{color: '#f44336', fontWeight: 'bold'}}>✗ REJECTED</span>}
                                            </div>
                                            <div>State: {step.state}</div>
                                            <div>Position: {step.position} {step.currentSymbol ? `(Reading: ${step.currentSymbol})` : ''}</div>
                                            <div>Remaining: "{step.remaining}"</div>
                                            <div>Stack: [{step.stack.join(', ')}]</div>
                                            <div style={{fontWeight: '500', marginTop: '0.5rem'}}>{step.desc}</div>
                                            <div style={{fontFamily: 'monospace', fontSize: '0.85rem', opacity: 0.8}}>{step.transition}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        // Initialize React
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
