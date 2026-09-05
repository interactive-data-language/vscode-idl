;+
; :Returns: Structure
;
; :Arguments:
;   m1: in, required, Number
;     First pendulum wieght
;   l1: in, required, Number
;     First arm length
;   th01: in, required, Number
;     First pendulum start angle
;   dth01: in, required, Number
;     First pendulum start anglular speed
;   m2: in, required, Number
;     Second pendulum weight
;   l2: in, required, Number
;     Second arm length
;   th02: in, required, Number
;     Second pendulum start angle
;   dth02: in, required, Number
;     Second pendulum start anglular speed
;   dT: in, required, Number
;     Delta-t
;   n: in, required, Number
;     Number of steps
;   g: in, required, Number
;     Gravity
;
;-
function AwesomeDoublePendulumProCode, m1, l1, th01, dth01, m2, l2, th02, dth02, dT, n, g
  compile_opt idl2, hidden
  on_error, 2

  ;+ Angular position of pendulum 1
  th1 = make_array(n, type = 5, /nozero)

  ;+ Angular velocity of pendulum 1
  thd1 = make_array(n, type = 5, /nozero)

  ;+ Angular acceleration of pendulum 1
  thdd1 = make_array(n, type = 5, /nozero)

  ;+ Angular position of pendulum 2
  th2 = make_array(n, type = 5, /nozero)

  ;+ Angular velocity of pendulum 2
  thd2 = make_array(n, type = 5, /nozero)

  ;+ Angular acceleration of pendulum 2
  thdd2 = make_array(n, type = 5, /nozero)

  ;+ Total energy (kinetic?)
  Ttot = make_array(n, type = 5, /nozero)

  ;+ Total enegery (potential)
  Utot = make_array(n, type = 5, /nozero)

  ;+ Pendulum 1 start deets
  th1[0] = th01 * !dtor
  thd1[0] = dth01 * !dtor

  ;+ Pendulum 2 start deets
  th2[0] = th02 * !dtor
  thd2[0] = dth02 * !dtor

  ; simulate
  for i = 0, n - 2 do begin
    ; calculate our energies
    Ttot[i] = 0.5 * m1 * ((thd1[i]) ^ 2) * (l1 ^ 2) + $
      0.5 * m2 * ((thd1[i] ^ 2) * (l1 ^ 2) + $
        (thd2[i] ^ 2) * (l2 ^ 2) + 2 * thd1[i] * thd2[i] * l1 * l2 * cos(th1[i] - th2[i]))
    Utot[i] = -g * l1 * (m1 + m2) * cos(th1[i]) - m2 * l2 * g * cos(th2[i])

    ; calculate our first angular acceleration
    top1 = -m2 * l1 * (thd1[i] ^ 2) * sin(th1[i] - th2[i]) * cos(th1[i] - th2[i]) + $
      g * m2 * sin(th2[i]) * cos(th1[i] - th2[i]) - $
      m2 * l2 * (thd2[i] ^ 2) * sin(th1[i] - th2[i]) - $
      (m1 + m2) * g * sin(th1[i])
    bottom1 = l1 * (m1 + m2) - m2 * l1 * (cos(th1[i] - th2[i]) ^ 2)
    thdd1[i] = top1 / bottom1

    ; calcualte our second angular acceleration
    top2 = m2 * l2 * (thd2[i] ^ 2) * sin(th1[i] - th2[i]) * cos(th1[i] - th2[i]) + $
      g * sin(th1[i]) * cos(th1[i] - th2[i]) * (m1 + m2) + $
      l1 * (thd1[i] ^ 2) * sin(th1[i] - th2[i]) * (m1 + m2) - $
      g * sin(th2[i]) * (m1 + m2)
    bottom2 = l2 * (m1 + m2) - m2 * l2 * (cos(th1[i] - th2[i]) ^ 2)
    thdd2[i] = top2 / bottom2

    ; do our numeric integration
    thd1[i + 1] = dT * thdd1[i] + thd1[i]
    thd2[i + 1] = dT * thdd2[i] + thd2[i]
    th1[i + 1] = th1[i] + dT * thd1[i] + .5 * (dT ^ 2) * thdd1[i]
    th2[i + 1] = th2[i] + dT * thd2[i] + .5 * (dT ^ 2) * thdd2[i]
  endfor

  ;+ X position of first pendulum
  x1 = l1 * sin(th1)

  ;+ Y position of first pendulum
  y1 = -l1 * cos(th1)

  ;+ X position of second pendulum
  x2 = x1 + l2 * sin(th2)

  ;+ Y position of second pendulum
  y2 = y1 - l2 * cos(th2)

  ; get the total energy
  Etot = Ttot + Utot
  Eerror = Etot - Etot[0]

  return, {x1: x1, y1: y1, x2: x2, y2: y2, etot: Etot, eerror: Eerror}
end

; mian level program
compile_opt idl2

;+
; Parameters related to the length of our simulation
;-

;+ Max time (seconds)
maxT = 10.0

;+ delta time between frames
dT = 0.0001d

;+ number of frames
n = ceil(double(maxT) / dT)

;+ animation frame rate
fps = 60

;+ goal dt between frames
dTGoal = 1d / fps

;+ The frequency of frames that we play from our simulation for 60 FPS
frameSpacing = floor(dTGoal / dT) > 1

;+ Strength of gravity (m/s^2)
g = 3d

;+ First pendulum start angle (degrees)
th01 = 90

;+ First pendulum angular velocity (degrees/second)
dth01 = 42

;+ Mass of pendulum 1 (kg)
m1 = 0.5

;+ Length of pendulum 1 arm (meters)
L1 = 0.5

;+ Second pendulum start angule (degrees)
th02 = 30

;+ Second pendulum angular velocity (degrees/second)
dth02 = -360

;+ Mass of pendulum 2 (kg)
m2 = 2

;+ Length of pendulum arm 2 (meters)
L2 = 0.5

;+ max range of our pendulum
range = (L1 + L2) * [-1, 1]

;+ Simulate!
results = AwesomeDoublePendulumProCode( $
  m1, L1, th01, dth01, $
  m2, L2, th02, dth02, dT, $
  n, g)

;+
; Unpack our results
;-

;+ X position of first pendulum
x1 = results.x1

;+ Y position of first pendulum
y1 = results.y1

;+ X position of second pendulum
x2 = results.x2

;+ Y position of second pendulum
y2 = results.y2

; get the total energy
Etot = results.etot
Eerror = results.eerror

;+ Data for pendulum arms
lines = {IDLNotebookPlot_LineAnimation, $
  properties: orderedhash(), $
  frames: list()}

;+ Data for our pendulums
pendulums = {IDLNotebookPlot_BubbleAnimation, $
  properties: orderedhash(), $
  frames: list()}

;+ Create sizes of pendulums
if (m1 gt m2) then begin
  sizes = list(20, 20 * sqrt(m2 / m1))
endif else begin
  sizes = list(20 * sqrt(m1 / m2), 20)
endelse

;+ Get the indices for the frames we want to display
frames = [0 : n - 1 : frameSpacing]
foreach i, frames do begin
  ; add our frame
  lines.frames.add, {IDLNotebookPlot_LineFrame, $
    x: list(0, x1[i], x2[i]), $
    y: list(0, y1[i], y2[i])}

  ; add our frame
  pendulums.frames.add, {IDLNotebookPlot_BubbleFrame, $
    x: list(x1[i], x2[i]), $
    y: list(y1[i], y2[i]), $
    r: sizes}
endforeach

;+ Create chart propreties- CASE SENSITIVE
props = orderedhash()
props['frameInterval'] = 1000 / fps ; ms per frame
props['aspectRatio'] = 1

; get axis range
scale = orderedhash('min', range[0] * 1.25, 'max', range[1] * 1.25)

; set axis range
props['scales'] = orderedhash('x', scale, 'y', scale)

;+ Create notebook plot
plot = {IDLNotebookPlot, $
  properties: props, $
  data: list(pendulums, lines)}

;+ Add to our notebook
IDLNotebook.AddToNotebook, plot

; plot in our browser
awesome_browser_ex

end