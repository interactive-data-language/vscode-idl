---
agent: 'agent'
description: 'Save ENVI Tool Workflow for re-use'
---

Your goal is to summarize an ENVI processing workflow for a user so that an agent can replicate the processing steps with new datasets.

## WORKFLOW CONTENT PATTERN

When creating workflow instructions, follow these LLM instruction best practices:

**Structure Requirements**:

- Use hierarchical markdown headers (##, ###)
- Organize as: OVERVIEW → REQUIREMENTS → KEY CONCEPTS → WORKFLOW
- Put critical requirements and constraints at the top
- Use consistent step format: Step name → Action with tool → Brief notes

**Language Style**:

- Use directive language: "MUST", "CRITICAL", "Required"
- Bold tool names and required parameters
- Explicitly label optional steps and parameters
- Use numbered steps with clear action verbs

**Content Guidelines**:

- Front-load prerequisites and data requirements
- Include practical examples where helpful
- Note dependencies between steps
- Explain WHY when the rationale isn't obvious
- Be concise but complete - avoid unnecessary elaboration

## CREATION STEPS

1. Ask for the name of the workflow to be created.

The naming convention follows "Workflow Name", where the name should be a very short and concise description of the workflow.

2. Compose the workflow instructions following the content pattern above.

**DON'T** add details for how steps connect together

**DO** keep the step descriptions short and concise

Here is an example used for image registration:

```markdown
## OVERVIEW

Align two images to one another by finding matching features and warping one image to match the other.

## REQUIREMENTS

**Required Data**:

- Base image (reference with accurate georeferencing)
- Warp image (image to be corrected/aligned)

**Data Best Practices**:

- Base image should have higher quality georeferencing (e.g., orthophoto, standard projection)
- Images should have overlapping coverage area
- Images should contain identifiable common features

## KEY CONCEPTS

**Base vs. Warp**: The base image is the "truth" reference. The warp image gets resampled to match the base image's coordinate system and pixel grid.

**Tie Points**: Matching pixel locations between images. Automated methods find hundreds of candidates, but filtering is critical to remove false matches.

**Transform Types**: Different geometric corrections suit different distortion types:

- **RST (Rotation, Scale, Translation)**: Simple shifts and rotations
- **Polynomial**: Handles shearing and non-linear distortions
- **Triangulation**: Best for local terrain-induced distortions

## WORKFLOW

Execute all steps in order for accurate registration.

### Step 1: Assign Image Roles

Establish reference (Base) and image to correct (Warp) by reviewing map information for both images.

**Notes:**

- **INPUT_RASTER1 (Base)**: Assign image with better georeferencing (orthophoto, standard projection)
- **INPUT_RASTER2 (Warp)**: Assign image needing correction (raw aerial photo, arbitrary projection)

### Step 2: Generate Tie Points

Automatically find matching features between images by selecting method based on sensor types.

**For similar sensors (Optical-to-Optical)**, run **GenerateTiePointsByCrossCorrelation**.

**Notes:**

- Standard method for same-modality registration
- Finds features with similar pixel intensity patterns

**For different sensors (Multi-Modal)**, run **GenerateTiePointsByMutualInformation**.

**Notes:**

- Use for SAR-to-Optical, Thermal-to-Visible, or other cross-sensor registration
- Works when pixel values don't correlate linearly

### Step 3: Filter Tie Points

Remove false matches (outliers) that would distort final image by running **FilterTiePointsByGlobalTransform**.

### Step 4: Warp Image

Resample warp image to match base image's coordinate grid by running **ImageToImageRegistration**.

**Notes:**

- **WARPING = 'Triangulation'**: Best for terrain-induced local distortions (recommended)
- **WARPING = 'Polynomial'**: Smoother global fit for systematic distortions
```

3. Call the **save-envi-tool-workflow** MCP tool with the workflow name and the composed markdown content.

The tool will automatically save the file to the correct location and return an error if a workflow with the same name already exists.
