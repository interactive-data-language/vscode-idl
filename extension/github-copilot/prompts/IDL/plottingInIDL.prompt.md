# IDL 2D Plotting Best Practices

### Basic Plotting Functions

**PLOT()** - Use for continuous data, line graphs, trends

- Best for: Time series, mathematical functions, connected data points
- Example: Temperature over time, signal processing

**SCATTERPLOT()** - Use for discrete, unconnected data points

- Best for: Correlations, distributions, individual measurements
- Example: Height vs weight, experimental observations

**BARPLOT()** - Use for categorical comparisons

- Best for: Comparing categories, frequency distributions
- Example: Sales by region, survey responses

**ERRORPLOT()** - Use when showing uncertainty

- Best for: Scientific data with error bars, confidence intervals
- Example: Experimental measurements with standard deviations

**POLARPLOT()** - Use for angular/cyclical data

- Best for: Directional data, periodic phenomena
- Example: Wind direction, antenna radiation patterns

**CONTOUR()** - Use for 2D scalar fields

- Best for: Elevation maps, temperature distributions, potential fields
- Example: Topographic maps, pressure systems

**FILLPLOT()** - Use to show area between curves

- Best for: Confidence bands, ranges, differences between datasets
- Example: Upper/lower bounds, shaded regions

**BOXPLOT()** - Use for statistical distributions

- Best for: Comparing distributions, showing quartiles and outliers
- Example: Test scores across classes, salary distributions

---

## 2. Function Graphics vs Direct Graphics

### Always Prefer Function Graphics

**Function Graphics** (plot, scatterplot, etc.)
✓ Easier to use and more intuitive
✓ Better maintained and more reliable
✓ Automatic memory management
✓ Interactive by default
✓ Consistent syntax across functions

**Direct Graphics** (plot command style)
✗ Older legacy system
✗ More verbose and complex
✗ Limited interactivity
✗ Manual window management required

**Recommendation**: Use function graphics unless you have a specific reason not to.

---

## 3. Creating Effective Plots

### Basic Plot Structure

```idl
compile_opt idl2

; 1. Generate or load your data
x = [0:100] * 0.1
y = sin(x)

; 2. Create the plot with essential properties
p = plot(x, y, $
  title='Sine Wave', $
  xtitle='Angle (radians)', $
  ytitle='Amplitude', $
  thick=2)
```

### Essential Properties for Every Plot

**Always include:**

- `title` - What is the plot showing?
- `xtitle` and `ytitle` - What do the axes represent (with units)?

**Consider adding:**

- `color` - Distinguish multiple datasets
- `dimensions` - Control plot size `[width, height]` in pixels
- `margin` - Adjust whitespace around plot (0.1 to 0.2 typical)
- `font_size` - Ensure readability
- `name` - For legends when using multiple datasets

---

## 4. Customization Best Practices

### Colors

**Use named colors for clarity:**

```idl
color='red', color='blue', color='dark green'
```

**Use RGB arrays for custom colors:**

```idl
color=[200, 100, 50]  ; RGB values 0-255
```

**Color Recommendations:**

- Use high contrast for multiple datasets
- Avoid red-green combinations (colorblind users)
- UseColorBrewer palettes for science/publication
- Keep backgrounds neutral (white or light gray)

### Line Styles and Markers

**Line thickness:**

```idl
thick=2     ; Standard for presentations
thick=3     ; Bold for emphasis
thick=0.5   ; Subtle grid lines
```

**Line styles:**

```idl
linestyle='-'   ; Solid (default)
linestyle='--'  ; Dashed
linestyle=':'   ; Dotted
linestyle='-.'  ; Dash-dot
linestyle='none' ; No line (scatter only)
```

**Symbols:**

```idl
symbol='circle', symbol='square', symbol='triangle'
symbol='diamond', symbol='star', symbol='plus'
sym_size=1.5  ; Adjust symbol size
sym_filled=1  ; Fill symbols
sym_color='red'  ; Symbol color
```

### Axis Control

**Set axis ranges explicitly:**

```idl
xrange=[0, 10]  ; Don't let IDL auto-scale unexpectedly
yrange=[-1, 1]
```

**Log scales when needed:**

```idl
/xlog  ; Logarithmic x-axis
/ylog  ; Logarithmic y-axis
```

**Hide axis labels when appropriate:**

```idl
xtickformat='(A1)'  ; Hide x-axis numbers
ytickformat='(A1)'  ; Hide y-axis numbers
```

### Transparency and Layers

**Use transparency for overlapping data:**

```idl
transparency=50  ; 0=opaque, 100=invisible
```

**Overlay multiple graphics:**

```idl
p1 = plot(x, y1, color='blue')
p2 = plot(x, y2, color='red', /overplot)  ; Add to existing plot
```

**Use /CURRENT to add to same window:**

```idl
p1 = plot(x, y1)
p2 = plot(x, y2, /current)  ; New plot in same window
```

---

## 5. Performance Tips

### Array Operations (FAST)

**Do this:**

```idl
; Vectorized - operates on entire array at once
y = sin(x) + cos(x/2) * 3.5
```

**Not this:**

```idl
; Loop - much slower
for i=0, n_elements(x)-1 do begin
  y[i] = sin(x[i]) + cos(x[i]/2) * 3.5
endfor
```

### Pre-allocate Arrays

**Do this:**

```idl
n = 10000
data = fltarr(n)  ; Pre-allocate
for i=0, n-1 do data[i] = compute_value(i)
```

**Not this:**

```idl
for i=0, 9999 do begin
  data = [data, compute_value(i)]  ; Slow! Reallocation every iteration
endfor
```

### Update Plot Properties, Don't Recreate

**Do this:**

```idl
p = plot(x, y)
p.color = 'red'      ; Fast property update
p.thick = 3
p.title = 'Updated'
```

**Not this:**

```idl
p = plot(x, y)
p = plot(x, y, color='red', thick=3)  ; Recreates entire plot
```

### Best Practices Checklist

✓ Use function graphics (plot, scatterplot, etc.)
✓ Always include title and axis labels with units
✓ Set line thickness >= 2 for visibility
✓ Use explicit axis ranges when needed
✓ Choose appropriate colors (high contrast, colorblind-friendly)
✓ Use vectorized array operations (avoid loops)
✓ Add legends when showing multiple datasets
✓ Use transparency for overlapping data
✓ Pre-allocate arrays for performance
✓ Test plots at intended display size
✓ Consider your audience (screen vs print vs publication)

---

## Additional Resources

- IDL Online Help: Function Graphics section
- Example code: IDL installation examples directory
- Color tables: `help, /rgb_tables` or `showcolortables`
- Symbols: `help, plot` and search for SYM_OBJECT

---

**Remember**: The goal of plotting is communication. Make your plots:

- Clear and easy to understand
- Properly labeled with units
- Appropriately sized for the medium (screen/paper)
- Visually appealing but not distracting

Happy plotting!
