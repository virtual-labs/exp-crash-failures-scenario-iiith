# Crash Failure Scenario in Synchronous System

We consider fail-stop model with n processes, where up to f < n processes may stop (and fail). The task is to reach consensus on a particular variable, say x (integer). If we are to tolerate f failures, we run the protocol for f+1 rounds. We argue, using in-line exercises, that at the end of the protocol, local value x in all active machines is guaranteed to be the consensus value. Every machine executes the protocol synchronously.

## Algorithm

**Every process runs the following for f+1 iterations:**

1. If the current value of x has not been broadcast then broadcast(x):
2. y<sub>j</sub> ← value (if any) received from process j in this round;
3. x ← min<sub>∀j</sub>(x,y<sub>j</sub>) ;

*Final value of x is the consensus value*.

## Analysis 

### Agreement  
Since there are f+1 rounds, there exist at least 1 round, say r*, in which all good processes could broadcast their value i.e. no process failed. As a result, latest value is broadcast and received by all, and all update their values to the minima. 

*In-line Exercise 1* : Argue that agreement holds even when a good process is silent in round r*. 

### Correctness 
Holds because once consensus is achieved among good processes, value cannot change. 

### Termination  
In-line Exercise 2 : Argue that above protocol terminates. 
