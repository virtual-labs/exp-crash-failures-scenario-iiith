// CONSTANTS
// ---------

/** Input element for number of processes. */
const IPROCESSES = document.getElementById("processes");
/** Input element for the simulation objective. */
const IOBJECTIVE = document.getElementById("objective");
/** Canvas element for simulation visualization. */
const CDISPLAY   = document.getElementById("display");
/** Start button. */
const BSTART = document.getElementById("start");
/** Stop button. */
const BSTOP  = document.getElementById("stop");

/** Simulation speed, in milliseconds per real second. */
const SIMULATION_SPEED = 0.5;
/** Color of the main text. */
const MAIN_TEXT_COLOR = '#000';
/** Font of the main text. */
const MAIN_TEXT_FONT  = 'bold 16px Helvetica';
/** Radius of each process node. */
const PROCESS_RADIUS = 20;
/** Color for active processes. */
const PROCESS_ACTIVE_COLOR  = '#4CAF50';
/** Color for crashed processes. */
const PROCESS_CRASHED_COLOR = '#666666';
/** Border color of the process nodes. */
const PROCESS_BORDER_COLOR = '#000';
/** Color of the text on the process nodes. */
const PROCESS_TEXT_COLOR = '#000';
/** Thickness of the arrow for message sends. */
const ARROW_THICKNESS = 4;
/** Length of the arrow head for message sends. */
const ARROW_HEAD  = 20;
/** Angle of the arrow head for message sends. */
const ARROW_ANGLE = Math.PI / 6;
/** Color of the arrow for message sends. */
const ARROW_COLOR = '#007BFF';
/** Color of the text on the arrow. */
const ARROW_TEXT_COLOR = '#000';
/** Name of each phase in a round. */
const PHASE_NAMES = [
  'Each process broadcasts its value',
  'Each process computes the minimum of received values',
  'Each process broadcasts the minimum value',
  'Each process checks for consensus'
];



// PARAMETERS
// ----------

/** Simulation details. */
var simulation = {
  /** Is the simulation running? */
  isRunning: false,
  /** Is the simulation paused? */
  isPaused: false,
  /** Is the simulation resumed? */
  isResumed: true,
  /** Current simulation timestamp. */
  timestamp: 0,
  /** Current simulation time. */
  time: 0,
  /** Current round number. */
  round: 0,
  /** Phase of the current round. */
  phase: 0,
  /** Time in the current round. */
  roundTime: 0,
  /** Time in the current phase. */
  phaseTime: 0,
  /** List of processes in the system. */
  processes: [],
  /** Any additional information. */
  info: '',
  /** Simulation objective. */
  objective: 'formin2',
};



// CLASSES
// -------

/**
 * Represents a process node in the system.
 */
class Process {
  /**
   * Create a new process node.
   * @param {number} id process ID
   * @param {number} x x-coordinate of the process node
   * @param {number} y y-coordinate of the process node
   * @param {number} value initial value of the process
   */
  constructor(id, x, y, value) {
    this.id = id;  // Process ID
    this.x = x;    // x-coordinate of the process node
    this.y = y;    // y-coordinate of the process node
    this.value = value;        // Current value of the process
    this.received    = [];     // Received values from other processes
    this.isCrashed   = false;  // Is the process crashed?
    this.crashTime   = 0;      // Simulation time of crash
    this.isSatisfied = false;  // Consensus reached?
  }
}



// FUNCTIONS
// ---------

/**
 * Main function.
 */
function main() {
  BSTART.onclick = onStartClick;
  BSTOP.onclick  = onStopClick;
  CDISPLAY.addEventListener('click', e => {
    console.log('CDISPLAY click');
    var r = CDISPLAY.getBoundingClientRect();
    var x = (e.clientX - r.left) * CDISPLAY.width  / r.width;
    var y = (e.clientY - r.top)  * CDISPLAY.height / r.height;
    onProcessClick(x, y);
  });
  // Let some rendering happen.
  var s = simulation;
  var P = parseInt(IPROCESSES.value, 10);
  startSimulation(P);
  renderSimulation();
  s.isPaused  = true;
  s.isResumed = false;
}
main();


/**
 * Handle click on the start button.
 */
function onStartClick() {
  var s = simulation;
  var P = parseInt(IPROCESSES.value, 10);
  var O = IOBJECTIVE.value;
  console.log('onStartClick()', s);
  if (!s.isRunning || s.processes.length !== P || s.objective !== O) {
    if (isNaN(P) || P<3 || P>20) {
      alert('Please enter a number between 3 and 20.');
      return;
    }
    s.objective = O;
    startSimulation(P);
  }
  else {
    s.isPaused  = s.isRunning? !s.isPaused : false;
    s.isResumed = !s.isPaused;
  }
  drawButtons();
  requestAnimationFrame(simulationLoop);
}


/**
 * Handle click on the stop button.
 */
function onStopClick() {
  var s  = simulation;
  console.log('onStopClick()');
  s.info = 'Simulation stopped';
  stopSimulation();
  drawButtons();
}


/**
 * Stop the simulation.
 */
function stopSimulation() {
  var s = simulation;
  s.isRunning = false;
  s.isPaused  = false;
  s.isResumed = true;
  renderSimulation();
}


/**
 * Handle click on a process node.
 * @param {number} x x-coordinate of the click
 * @param {number} y y-coordinate of the click
 */
function onProcessClick(x, y) {
  var s = simulation;
  if (!s.isRunning) return;
  for (var p of s.processes) {
    var dx = x - p.x;
    var dy = y - p.y;
    var r  = Math.sqrt(dx*dx + dy*dy);
    if (r >= PROCESS_RADIUS || p.isCrashed) continue;
    p.isCrashed = true;
    p.crashTime = s.time;
  }
}


/**
 * Start the simulation.
 * @param {number} P number of processes
 */
function startSimulation(P) {
  var s = simulation;
  resetSimulation();
  initProcesses(P);
  s.isRunning = true;
  s.info = 'Click on a process to crash it';
}


/**
 * Reset the simulation.
 */
function resetSimulation() {
  var s = simulation;
  s.isRunning = false;
  s.isPaused  = false;
  s.isResumed = true;
  s.timestamp = 0;
  s.time  = 0;
  s.round = 0;
  s.phase = 0;
  s.roundTime = 0;
  s.phaseTime = 0;
  s.processes = [];
  s.info = '';
}


/**
 * Main simulation loop.
 */
function simulationLoop(timestamp) {
  var s = simulation;
  if (!s.isRunning || s.isPaused) return;
  if (s.isResumed) {
    s.timestamp = timestamp;
    s.isResumed = false;
  }
  else updateSimulation(timestamp);
  renderSimulation();
  requestAnimationFrame(simulationLoop);
}


/**
 * Update the simulation state.
 * @param {number} timestamp timestamp of the current frame
 * @note
 * It takes P-1 seconds to broadcast the value to all other processes. \
 * It takes 1 second to compute the minimum value from the received values. \
 * It takes P-1 seconds to broadcast the minimum value to all other processes. \
 * It takes 1 second to check for consensus. \
 * The total time for each round is 2P seconds.
 */
function updateSimulation(timestamp) {
  var s = simulation;
  var P = s.processes.length;
  // Update the simulation time.
  var dt = 0.001 * SIMULATION_SPEED * (timestamp - s.timestamp);
  s.timestamp = timestamp;
  s.time += dt;
  // Compute the current round and phase.
  var rt  = s.time % (2 * P);
  s.round = Math.floor(s.time / (2 * P));
  s.phase = rt < P-1? 0 : (rt < P? 1 : (rt < 2*P-1? 2 : 3));
  s.roundTime = rt;
  s.phaseTime = rt < P-1? rt : (rt < P? rt-P-1 : (rt < 2*P-1? rt-P : rt-2*P-1));
  // Perform round updates.
  if (s.phase===1) updateReceivedValues();
  else if (s.phase===2) computeMinValues();
  else if (s.phase===3) updateReceivedValues();
  else if (s.round>0 && s.phase===0) {
    checkConsensus();
    if (reachedConsensus()) {
      s.isRunning = false;
      s.info = 'Consensus reached!';
      s.round -= 1;
      s.phase = 3;
      s.roundTime = 0;
      s.phaseTime = 0;
      for (var p of s.processes)
        p.received = [];
      if (achievedObjective()) {
        unlockObjectives(s.objective);
        if (s.objective) s.info += '\nYou have also achieved the objective!\nYou can now try the next objective.';
      }
      else s.info += '\nYou have not achieved the objective.\nPlease try again.';
    }
    drawButtons();
  }
}


/**
 * Update the received values for each process.
 */
function updateReceivedValues() {
  var s = simulation;
  var P = s.processes.length;
  for (var i=0; i<P; ++i) {
    var p = s.processes[i];
    if (p.isCrashed || p.received.length !== 0) continue;
    for (var j=i-1; j>=i-P; --j) {
      var q = s.processes[(P+j) % P];
      // Each process sends in clockwise order every second.
      var prevPhaseStartTime = s.time - s.phaseTime - P;
      var recvTime = prevPhaseStartTime + (P+i-j+1) % P;
      if (q===p || (q.isCrashed && q.crashTime < recvTime)) continue;
      p.received.push(q.value);
    }
  }
}


/**
 * Get the received values for the current phase.
 * @param p process node
 * @returns {number[]} received values
 */
function receivedValues(p) {
  var s = simulation;
  var P = s.processes.length;
  var i = p.id;
  var received = [];
  if (p.isCrashed) return received;
  for (var j=i-1; j>=i-P; --j) {
    var q = s.processes[(P+j) % P];
    // Each process sends in clockwise order every second.
    var recvTime = s.time - s.phaseTime + (i-j) % P;
    if (q===p || (q.isCrashed && q.crashTime < recvTime)) continue;
    if (s.time > recvTime) received.push(q.value);
  }
  return received;
}


/**
 * Compute the minimum values for each process.
 */
function computeMinValues() {
  var s = simulation;
  for (var p of s.processes) {
    if (p.isCrashed || p.received.length === 0) continue;
    p.value = Math.min(p.value, ...p.received);
    p.received = [];
  }
}


/**
 * Count the number of crashed processes.
 */
function crashedProcesses() {
  var s = simulation;
  var n = 0;
  for (var p of s.processes)
    if (p.isCrashed) ++n;
  return n;
}


/**
 * Check for consensus among the processes.
 */
function checkConsensus() {
  var s = simulation;
  for (var p of s.processes) {
    if (p.isCrashed) continue;
    p.isSatisfied = p.received.every(v => v===p.value);
  }
}


/**
 * Check if the processes have reached consensus.
 */
function reachedConsensus() {
  var s = simulation;
  for (var p of s.processes) {
    if (p.isCrashed) continue;
    if (!p.isSatisfied) return false;
  }
  return true;
}


/**
 * Check the simulation objective has been met.
 */
function achievedObjective() {
  var s = simulation;
  switch (s.objective) {
    case 'formin2':  // Force consensus to run for at least 2 rounds
      return s.round>=1;
    case 'forext3':  // Force consensus to run for 3 rounds
      return s.round==2;
    case 'forext4':  // Force consensus to run for 4 rounds
      return s.round==3;
    case 'cr3ext4':  // Force consensus to run for 4 rounds, crashing only 3 processes
      return s.round==3 && crashedProcesses()===3;
    default:  // Just exploring
      return true;
  }
}


/**
 * Unlock the objectives based on the simulation results.
 * @param {string} objective objective which was achieved
 */
function unlockObjectives(objective) {
  var options = IOBJECTIVE.options;
  var shouldBreak = false;
  for (var i=0; i<options.length; ++i) {
    var opt = options[i];
    opt.disabled = false;
    if (shouldBreak) break;
    if (opt.value===objective) shouldBreak = true;
  }
}


/**
 * Render the simulation.
 * @note
 * It takes P-1 seconds to broadcast the value to all other processes. \
 * It takes 1 second to compute the minimum value from the received values. \
 * It takes P-1 seconds to broadcast the minimum value to all other processes. \
 * It takes 1 second to check for consensus. \
 * The total time for each round is 2P seconds.
 */
function renderSimulation() {
  var s = simulation;
  var P = s.processes.length;
  // Draw the processes.
  clearDisplay();
  for (var p of s.processes)
    drawProcess(p);
  // Draw messages between processes.
  if (s.roundTime > 0 && (s.phase===0 || s.phase===2)) {
    for (var i=0; i<P; ++i) {
      var di  = Math.floor(s.phaseTime);
      var src = s.processes[i];
      var dst = s.processes[(i+di+1) % P];
      var prg = s.phaseTime - di;
      if (src.isCrashed) continue;
      drawMessage(src, dst, ''+src.value, prg);
    }
  }
  // Draw the round number and phase.
  var ctx = CDISPLAY.getContext('2d');
  ctx.fillStyle = MAIN_TEXT_COLOR;
  ctx.textAlign = 'left';
  ctx.font = MAIN_TEXT_FONT;
  ctx.fillText(`Round: ${s.round + 1} : ${PHASE_NAMES[s.phase]}`, 20, 30);
  // Draw any additional information.
  if (!s.info) return;
  var infos = s.info.split('\n');
  ctx.textAlign = 'center';
  for (var i=0; i<infos.length; ++i)
    ctx.fillText(infos[i], CDISPLAY.width/2, CDISPLAY.height/2 + 20*i);
}


/**
 * Initialize the process nodes.
 * @param {number} P number of processes
 */
function initProcesses(P) {
  var s = simulation;
  var W = CDISPLAY.width;
  var H = CDISPLAY.height;
  s.processes = [];
  // Position each process in a circle.
  var da = 2 * Math.PI / P;
  var r  = Math.min(W, H)/2.5;
  var cx = W/2, cy = H/2;
  for (var i=0; i<P; ++i) {
    var a = i * da;
    var x = cx + r * Math.cos(a);
    var y = cy + r * Math.sin(a);
    var p = new Process(i, x, y, Math.floor(Math.random() * 100));  // Random initial value
    s.processes.push(p);
  }
}


/**
 * Draw a process node.
 * @param {Process} p process to draw
 */
function drawProcess(p) {
  var s   = simulation;
  var ctx = CDISPLAY.getContext('2d');
  // Draw the process node circle.
  ctx.beginPath();
  ctx.arc(p.x, p.y, PROCESS_RADIUS, 0, 2 * Math.PI);
  ctx.fillStyle = p.isCrashed? PROCESS_CRASHED_COLOR : processColor(s.time);
  ctx.fill();
  ctx.lineWidth   = ARROW_THICKNESS;
  ctx.strokeStyle = PROCESS_BORDER_COLOR;
  ctx.stroke();
  ctx.closePath();
  // Draw the process node ID and value.
  ctx.font = MAIN_TEXT_FONT
  ctx.fillStyle = PROCESS_TEXT_COLOR;
  ctx.textAlign = 'center';
  ctx.fillText(`P${p.id+1}`, p.x, p.y - 1.25 * PROCESS_RADIUS);
  ctx.fillText(''+p.value,   p.x, p.y + 0.25 * PROCESS_RADIUS);
  // Draw the receieved values.
  var received = s.phase===0 || s.phase===2? receivedValues(p) : p.received;
  var recvtxt  = received.join(', ');
  ctx.fillText(recvtxt, p.x, p.y + 1.8 * PROCESS_RADIUS);
}


/**
 * Generate a color for a process node.
 * @param {number} time current simulation time
 * @returns {string} color for the process node
 */
function processColor(time) {
  var r = Math.floor(128 + 127 * Math.sin(time));
  var g = Math.floor(128 + 127 * Math.sin(time + 2*Math.PI/3));
  var b = Math.floor(128 + 127 * Math.sin(time + 4*Math.PI/3));
  return `rgb(${r},${g},${b})`;
}


/**
 * Draw a message (arrow) between two process nodes.
 * @param {Process} src source process
 * @param {Process} dst destination process
 * @param {string} text message text
 * @param {number} prg progress of the message (0 to 1)
 */
function drawMessage(src, dst, text, prg) {
  var ctx = CDISPLAY.getContext('2d');
  // Draw the arrow line.
  var dx  = dst.x - src.x;
  var dy  = dst.y - src.y;
  var r   = Math.sqrt(dx*dx + dy*dy);
  var lbx = src.x + (PROCESS_RADIUS * dx) / r;
  var lby = src.y + (PROCESS_RADIUS * dy) / r;
  var ldx = dst.x - (PROCESS_RADIUS * dx) / r;
  var ldy = dst.y - (PROCESS_RADIUS * dy) / r;
  var lex = lbx + prg * (ldx - lbx);
  var ley = lby + prg * (ldy - lby);
  ctx.beginPath();
  ctx.moveTo(lbx, lby);
  ctx.lineTo(lex, ley);
  ctx.strokeStyle = ARROW_COLOR;
  ctx.lineWidth   = ARROW_THICKNESS;
  ctx.stroke();
  ctx.closePath();
  // Draw the arrow head.
  var a   = Math.atan2(dy, dx);
  var h1x = lex - ARROW_HEAD * Math.cos(a - ARROW_ANGLE);
  var h1y = ley - ARROW_HEAD * Math.sin(a - ARROW_ANGLE);
  var h2x = lex - ARROW_HEAD * Math.cos(a + ARROW_ANGLE);
  var h2y = ley - ARROW_HEAD * Math.sin(a + ARROW_ANGLE);
  ctx.beginPath();
  ctx.moveTo(lex, ley);
  ctx.lineTo(h1x, h1y);
  ctx.lineTo(h2x, h2y);
  ctx.fillStyle = ARROW_COLOR;
  ctx.fill();
  ctx.closePath();
  // Draw message value near the midpoint.
  var mx = (lbx + lex) / 2;
  var my = (lby + ley) / 2;
  ctx.fillStyle = ARROW_TEXT_COLOR;
  ctx.fillText(text, mx, my - 10);
}


/**
 * Clear the display.
 */
function clearDisplay() {
  var ctx = CDISPLAY.getContext('2d');
  ctx.clearRect(0, 0, CDISPLAY.width, CDISPLAY.height);
}


/**
 * Render button text.
 */
function drawButtons() {
  var s = simulation;
  BSTART.textContent = s.isRunning? (s.isPaused? 'Resume simulation' : 'Pause simulation') : 'Start simulation';
}
