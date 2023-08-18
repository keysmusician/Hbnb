from models.category import Category


category_names = [
    'Beachfront',
    'Lakefront',
    'Amazing pools',
    'Windmills',
    'Tropical',
    'Mansions',
    'Amazing views',
    'Castles',
    'Boats',
    'Islands',
    'Underground',
    'Tiny homes',
    'Treehouses',
    'OMG!',
    'Trending',
    'Luxe',
    'Off the grid',
    'Countryside',
    'Play',
    'Houseboats',
    'Unique stays',
    'Camping',
    'A-frames',
    'Barns',
]

categories = [Category(name=category_name) for category_name in category_names]

for category in categories:
    #category.save()
