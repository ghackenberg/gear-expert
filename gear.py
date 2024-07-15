import FreeCAD as App
import FreeCADGui
import ImportGui
import freecad.gears.commands
from BOPTools import BOPFeatures

import math
import os

import pathlib

def PrintL(string):

    App.Console.PrintMessage(string)



def createGear(module, teeth, name, addShaft):

    gearThickness = 10
    shaftLength = 30

    gear = freecad.gears.commands.CreateInvoluteGear.create()
    #PrintL(f"{gear.Name}\n\n")
    
   
    #gear.Label = name
    gear.module = module
    gear.teeth = teeth
    gear.beta = 0   # Schrägverzahnung (angle)
    gear.height = gearThickness

    
    App.ActiveDocument.recompute()
    Gui.SendMsgToActiveView("ViewFit")
    
    shaft = App.ActiveDocument.addObject("Part::Cylinder", f"shaft{teeth}")
    shaft.Label = f"shaft{teeth}"
    shaft.Radius = 2
    shaft.Height = shaftLength
    shaft.Placement.Base.z -= (shaftLength - gearThickness) / 2
    
    cyl1 = App.ActiveDocument.addObject("Part::Cylinder", f"cyli{teeth}")
    cyl1.Label = f"cyli{teeth}"
    cyl1.Radius = 0.5
    cyl1.Placement.Base.x = module * teeth/4 
    cyl1.Placement.Base.y = 0

    
    # Bool opearation gear and shaft
    bp = BOPFeatures.BOPFeatures(App.activeDocument())
    
    if addShaft:
        gear = bp.make_multi_fuse([gear.Name, shaft.Name, ])
    else:
        gear = bp.make_cut([gear.Name, shaft.Name, ])
    App.ActiveDocument.recompute()
    
    PrintL(f"!!!{name}")
    
    #PrintL(f"{dir(gear)}")
    
    bp1 = BOPFeatures.BOPFeatures(App.activeDocument())
    gear = bp1.make_cut([gear.Name, cyl1.Name, ])
    App.ActiveDocument.recompute()
    

    PrintL("Save as GLB:\n")

    path =  f"{pathlib.Path(__file__).parent.resolve()}"          # Path of this file
    
    PrintL(f"Path: {path}\n")
    
    fname = path + u"\\output\\" + name + ".gltf"                         # Filename for gltb
    
    PrintL(f"Filename: {fname}\n")
    PrintL(f"Object: {gear}\n")
    

    if hasattr(ImportGui, "exportOptions"):
        PrintL("branch1, command options\n")
        
        options = ImportGui.exportOptions(fname)
        
        PrintL("branch1, export\n")
        
        ImportGui.export([gear], fname, options)
        
    else:
        PrintL("branch2\n")
        
        ImportGui.export([gear], fname)

    gear.Label = name
        
    return(gear)
   

def movePart(part, pos, angle):
    
    part.Placement.Base.x         += pos[0]
    part.Placement.Base.y         += pos[1]
    part.Placement.Rotation.Angle += angle


doc = FreeCAD.newDocument("myGears")
docName = doc.Name

PrintL(f"{docName}\n")

# Diameter d= z*m  (number of teeth times module)
modul = 2
teeth1 = 30                                                      
teeth2 = 20
teeth3 = 10

g30 = createGear(modul, teeth1, "gear30", 0)
g20 = createGear(modul, teeth2, "gear20", 0)
g10 = createGear(modul, teeth3, "gear10", 0)

gs30 = createGear(modul, teeth1, "gearShaft30", 1)
gs20 = createGear(modul, teeth2, "gearShaft20", 1)
gs10 = createGear(modul, teeth3, "gearShaft10", 1)


# Diameter
d1 = teeth1 * modul
d2 = teeth2 * modul
d3 = teeth3 * modul

movePart(g30, [0,                0], 0)
movePart(g20, [d1/2 + d2/2,      0],  math.pi / teeth2)
movePart(g10, [d1/2 + d2 + d3/2, 0], 0)
 
movePart(gs30, [0,                d1 ], math.pi / teeth1)
movePart(gs20, [d1/2 + d2/2,      d1 ],  0)
movePart(gs10, [d1/2 + d2 + d3/2, d1 ], math.pi / teeth3)







