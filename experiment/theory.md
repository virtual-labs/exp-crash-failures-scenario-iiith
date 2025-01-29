<<<<<<< HEAD
# Crash Failure Scenario in Synchronous System

Consider a fail-stop model with n processes, where up to f < n processes may fail (and stop). The task is to reach consensus on a particular variable, say x (integer). If we are to tolerate up to f failures, we run the algorithm for f+1 rounds. We argue, using in-line exercises, that at the end of the procedure, local value x in all active machines is guaranteed to be the consensus value. Every machine executes the protocol synchronously. This case assumes non-existence of Byzantine processes - i.e. adversary processes which may try to "fool" the system. 

## Algorithm

**Every process runs the following for f+1 iterations:**

1. If the current value of x has not been broadcast then broadcast(x):
2. y<sub>j</sub> ← value (if any) received from process j in this round;
=======
### Theory

Consider fail-stop model with n processes, where up to $f < n$ processes may fail (and stop). The task is to reach consensus on a particular variable, say $x$ (integer). If we are to tolerate up to $f$ failures, we run the algorithm for $f+1$ rounds. We argue, using in-line exercises, that at the end of the procedure, local value $x$ in all active machines is guaranteed to be the consensus value. Every machine executes the protocol synchronously. This case assumes non-existence of Byzantine processes - i.e. adversary processes which may try to "fool" the system.

<br>


#### Algorithm

**Every process runs the following for f+1 iterations:**

1. If the current value of $x$ has not been broadcast then $broadcast(x)$:
2. y<sub>j</sub> ← value (if any) received from process $j$ in this round;
>>>>>>> 973b0f674f5ca1ac7246d85e5b79791016f6c4f2
3. x ← min<sub>∀j</sub>(x,y<sub>j</sub>) ;

*Final value of x is the consensus value*.

<<<<<<< HEAD
## Analysis 

### Agreement  
Since there are f+1 rounds, there exist at least one round, say r*, in which all good processes could broadcast their value i.e. no process failed in r*. As a result, latest value is broadcast and received by all, and all update their values to the minima. 

### Correctness 
Holds because once consensus is achieved among good processes, value cannot change. Processes are non-byzantine, and a failed process never restarts. 

### Termination  
Since f+1 is finite, and there are constant number of operations in every iteration, algorithm clearly terminates, 
=======
<br>


#### Analysis

##### Agreement

Since there are $f+1$ rounds, there exist at least one round, say $r^*$, in which all good processes could broadcast their value i.e. no process failed in $r^*$. As a result, latest value is broadcast and received by all, and all update their values to the minima.

##### Correctness

Holds because once consensus is achieved among good processes, value cannot change. Processes are non-byzantine, and a failed process never restarts.

##### Termination

Since $f+1$ is finite, and there are constant number of operations in every iteration, algorithm clearly terminates,
>>>>>>> 973b0f674f5ca1ac7246d85e5b79791016f6c4f2
