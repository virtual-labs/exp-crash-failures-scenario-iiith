### Procedure

1. **Setup the Simulation:**
   - Open the simulation interface in a browser.

2. **Configure the Parameters:**
   - **Set the Number of Processes:**
     - Locate the "Number of processes" field in the controls section.
     - Enter the desired number of processes (minimum 3, maximum 20). The default value is 5.
   - **Choose the Objective:**
     - Open the dropdown menu labeled "Objective."
     - Select one of the available objectives, such as:
       - *Just exploring*: No specific goal; observe the behavior.
       - *Force consensus to run for at least 2 rounds* (default).
     - Note that some objectives are locked initially, and can be unlocked by achieving objectives.

3. **Run the Simulation:**
   - Click the **Start simulation** button to begin.
   - Observe the consensus process in the display canvas.
   - The same button can be used to pause/resume the simulation.

4. **Details of the Simulation:**
   - The simulation presents a visual representation of the processes, arranged in a circle.
   - Each process is represented by a colored circle and is initialized with a random value.
   - Over one or more rounds, the processes communicate with each other to reach a consensus.
   - Each round consists of four phases:
     - **Phase 1:** Each process sends its value to all other processes.
     - **Phase 2:** Each process finds the minimum value received from other processes.
     - **Phase 3:** Each process sends the minimum value to all other processes.
     - **Phase 4:** Each process verifies if the minimum value received from other processes is the same as its own value.
   - If the minimum value received is the same as the process's own value, the process has reached consensus.
   - If not, consensus is not reached, and the process continues to the next round until consensus is reached.
   - Failure to achieve consensus is due to the presence of crash failures in the system.
   - The algorithm is guaranteed to reach consensus in `f + 1` rounds, where `f` is the number of processes that can crash.

5. **Crash a Process:**
   - To simulate a crash failure, click on a process in the display canvas.
   - The process will be marked as crashed and will not participate in the consensus process.
   - The simulation will continue with the remaining processes.

6. **The Game:**
   - The goal is to trigger the right processes to crash at the right time to force the consensus algorithm to run for the desired number of rounds.
   - This helps in understanding the behavior of the consensus algorithm in the presence of crash failures.

7. **Repeat for Additional Objectives:**
   - Adjust the number of processes or select a different objective, and restart the simulation to explore various scenarios.
