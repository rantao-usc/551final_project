# This file transfer an image to numpy array, and get all its meta data
from numpy import asarray

# load and show an image with Pillow
from PIL import Image

# Open the image form working directory
image = Image.open('images/image0.jpg')

# Get the meta data of this image
print(image.format)
print(image.size)
print(image.mode)

# Convert this image to numpy array
data = asarray(image)
print(type(data))

# Summarize shape
print(data.shape)

# Print the value of each pixel of this NumPy array image.
print(data)
