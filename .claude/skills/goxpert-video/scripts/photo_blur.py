# Privacy blur for the AR-card photos. Boxes are in the 1500x2000 (or 2000x1500) preview space.
import sys
from PIL import Image, ImageFilter
SRC, OUT = sys.argv[1], sys.argv[2]
BOXES = {
 "p01": [(205,1040,735,1295),(345,1345,705,1430)],
 "p02": [(280,600,770,750),(835,618,1355,725),(495,1195,775,1545),(205,1285,440,1495)],
 "p06": [(320,165,835,365),(105,875,765,1170),(458,1224,652,1254),(372,1252,525,1276),(285,1278,745,1345),(1010,1105,1295,1255),(1030,1365,1295,1415)],
 "p07": [(880,1140,1070,1410),(890,1470,1030,1530),(830,500,1260,760)],
 "p08": [(630,550,1110,1100)],
 "p10": [(545,810,920,940),(395,1232,730,1495)],
 "p11": [(500,920,850,1025),(995,950,1145,1020)],
 "p12": [(560,695,800,750),(1090,1370,1500,2000),(840,1450,1020,1650)],
 "p13": [(440,970,570,1005),(640,1300,1270,1660),(365,1812,645,1878),(520,1790,610,1850),(355,1615,625,1705)],
}
# Boxes given in the photo's own pixel coordinates (no preview scaling).
NATIVE = {
 "p14": [(0,40,640,195),(160,385,725,595),(0,1088,545,1340),(115,1340,490,1428),(140,1425,520,1480),
         (785,1140,1080,1210),(690,1290,890,1418),(590,1440,815,1565),(990,1285,1080,1590),(905,1285,990,1422),(905,1505,1080,1590),(780,1505,905,1565)],
}
BOXES.update({k: v for k, v in NATIVE.items()})
LIGHT = {"p06": [(335,1180,652,1224)]}
import os
for name, boxes in BOXES.items():
    im = Image.open(os.path.join(SRC, name + ".jpg")).convert("RGB")
    W, H = im.size
    sx, sy = (1, 1) if name in NATIVE else (W / (2000 if W > H else 1500), H / (1500 if W > H else 2000))
    for (x0, y0, x1, y1) in boxes:
        b = tuple(int(v) for v in (x0 * sx, y0 * sy, x1 * sx, y1 * sy))
        reg = im.crop(b)
        w, h = reg.size
        reg = reg.resize((max(1, w // 28), max(1, h // 28)), Image.BILINEAR).resize((w, h), Image.BILINEAR)
        reg = reg.filter(ImageFilter.GaussianBlur(18))
        im.paste(reg, b)
    for (x0, y0, x1, y1) in LIGHT.get(name, []):
        b = tuple(int(v) for v in (x0 * sx, y0 * sy, x1 * sx, y1 * sy))
        im.paste(im.crop(b).filter(ImageFilter.BoxBlur(7)), b)
    im.save(os.path.join(OUT, name + ".jpg"), quality=92)
    print("ok", name)
