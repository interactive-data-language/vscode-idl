---
name: idl-create-2d-plot
description: 'Guide for IDL routines to use when creating 2D plots'
---

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
- `linestyle` - Differentiate lines in black & white printing
- `gridstyle` - Add gridlines for readability
- `legend` - Identify multiple data series

---

## 4. Multi-Plot Layouts

### Using `LAYOUT` Keyword

```idl
compile_opt idl2

; Create 2x2 grid
p1 = plot(x, y1, layout=[2,2,1], title='Plot 1')
p2 = plot(x, y2, layout=[2,2,2], title='Plot 2')
p3 = plot(x, y3, layout=[2,2,3], title='Plot 3')
p4 = plot(x, y4, layout=[2,2,4], title='Plot 4')
```

### Positioning Rules

- `LAYOUT = [columns, rows, position]`
- Positions are numbered left-to-right, top-to-bottom (1-based)
- Use `/CURRENT` to add plots without clearing the window

---

## 5. Exporting Plots

```idl
; Save to image file
p.save, 'my_plot.png', resolution=300
p.save, 'my_plot.pdf'
```
