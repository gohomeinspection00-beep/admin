# Privacy blur for the AR-card photos. Boxes are in the 1500x2000 (or 2000x1500) preview space.
import sys
from PIL import Image, ImageFilter
SRC, OUT = sys.argv[1], sys.argv[2]
BOXES = {
 "p01": [(205,1040,735,1295),(345,1345,705,1430)],
 "p02": [(280,565,770,750),(835,595,1355,725),(495,1195,775,1545),(205,1285,440,1495)],
 "p06": [(320,165,835,365),(105,875,765,1182),(335,1180,652,1224),(458,1222,652,1256),(285,1282,745,1345),(270,1238,760,1292),(1010,1105,1295,1255),(1030,1365,1295,1415)],
 "p07": [(880,1140,1070,1410),(890,1470,1030,1530),(830,500,1260,760)],
 "p08": [(630,550,1110,1100)],
 "p10": [(545,810,920,940),(395,1232,730,1495)],
 "p11": [(500,920,850,1025),(995,950,1145,1020)],
 "p12": [(560,695,800,750),(1090,1370,1500,2000),(840,1450,1020,1650)],
 "p13": [(440,970,570,1005),(640,1300,1270,1660),(365,1812,645,1878),(520,1790,610,1850),(355,1615,625,1705)],
}
import os
for name, boxes in BOXES.items():
    im = Image.open(os.path.join(SRC, name + ".jpg")).convert("RGB")
    W, H = im.size
    sx, sy = W / (2000 if W > H else 1500), H / (1500 if W > H else 2000)
    for (x0, y0, x1, y1) in boxes:
        b = tuple(int(v) for v in (x0 * sx, y0 * sy, x1 * sx, y1 * sy))
        reg = im.crop(b)
        w, h = reg.size
        reg = reg.resize((max(1, w // 28), max(1, h // 28)), Image.BILINEAR).resize((w, h), Image.BILINEAR)
        reg = reg.filter(ImageFilter.GaussianBlur(18))
        im.paste(reg, b)
    im.save(os.path.join(OUT, name + ".jpg"), quality=92)
    print("ok", name)
