/**
 * Code for use with the playground
 */
export const PLAYGROUND_CODE = `PRO ENVIBoundingBoxSet_Example

COMPILE_OPT IDL2, hidden

 

; Start the application

e = ENVI(/HEADLESS)

 

; Define bounding box rings

; [[xMin,yMin], [xMax,yMin], [xMax,yMax], [xMin,yMax], [xMin,yMin]]

boxes = [ $

  [[530, 381], [570, 381], [570, 421], [530, 421], [530, 381]], $

  [[438, 859], [478, 859], [478, 899], [438, 899], [438, 859]], $

  [[392, 212], [432, 212], [432, 252], [392, 252], [392, 212]], $

  [[636, 499], [676, 499], [676, 539], [636, 539], [636, 499]], $

  [[266, 519], [306, 519], [306, 559], [266, 559], [266, 519]], $

  [[398, 729], [438, 729], [438, 769], [398, 769], [398, 729]], $

  [[300, 486], [340, 486], [340, 526], [300, 526], [300, 486]], $

  [[400, 545], [440, 545], [440, 585], [400, 585], [400, 545]], $

  [[204, 723], [244, 723], [244, 763], [204, 763], [204, 723]]]

 

; Supplement class labels, colors, and bounding boxes

labels = List('red_car', 'green_car', 'blue_car')

colors = List([255,0,0], [0,255,0], [0,0,255])

classBoxes = (List(boxes[*,*,0:2], boxes[*,*,3:5], boxes[*,*,6:8])).ToArray(/TRANSPOSE)

 

; Construct the bounding box set

bboxSet = ENVIBoundingBoxSet()

 

; Iterate class labels, adding class information to the object

FOREACH name, labels, index DO BEGIN

  bboxSet.AddClass, CLASS=index, LABEL=name, COLOR=colors[index]

 

  ; Assign three boxes per class

  FOR n=0, 2 DO BEGIN

    bboxSet.AddBoundingBox, CLASS=index, BOUNDING_BOX=classBoxes[*,*,index,n]

  ENDFOR

ENDFOREACH

 

Print, 'Classes:'

Print, bboxSet.Classes

Print, 'Labels:'

Print, bboxSet.Labels

Print, 'Class Colors: '

Print, bboxSet.Colors

Print, 'Classes Count: ', bboxSet.nClasses

Print, 'Bounding Box Count: ', bboxSet.nBounding_Boxes

Print, 'Class to Bounding Box Map:'

Print, bboxSet.Bounding_Boxes_Per_Class

Print, 'Get Bounding Box by Index: '

 

; Get the first bounding box in class 0

Print, bboxSet.GetBoundingBox(CLASS=0, INDEX=0)

Print, 'Get All Class 1 Bounding Boxes:'

 

; Get all bounding boxes for class 1

Print, bboxSet.GetBoundingBox(CLASS=1, /ALL), /IMPLIED

 

; Remove boxes and classes

; First, remove all bounding boxes from class 0

bboxSet.RemoveBoundingBox, CLASS=0, /ALL

 

; Remove the bounding box at index 0 in class 1

bboxSet.RemoveBoundingBox, CLASS=1, INDEX=0

 

; Remove a bounding box from class 2 (using coordinates)

bboxSet.RemoveBoundingBox, CLASS=2, BOUNDING_BOX=classBoxes[*,*,2,0]

 

; Remove the red_car class

bboxSet.RemoveClass, CLASS=0

 

Print, 'After removing boxes and class 0.

Print, 'Classes:'

Print, bboxSet.Classes

Print, 'Labels:'

Print, bboxSet.Labels

Print, 'Class Colors: '

Print, bboxSet.Colors

Print, 'Classes Count: ', bboxSet.nClasses

Print, 'Bounding Box Count: ', bboxSet.nBounding_Boxes

Print, 'Class to Bounding Box Map:'

Print, bboxSet.Bounding_Boxes_Per_Class

 

; Get GeoJSON and display

geoJson = bboxSet.GetGeoJSON()

Print, geoJson, /IMPLIED

 

END`;
