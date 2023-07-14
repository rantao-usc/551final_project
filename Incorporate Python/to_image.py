# This Python file transfers all the numpy array (which is origianl form of image) to real image and save them in a folder

# Load dataset
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Load data of image
images = np.load('datasets/ps4_trainvalid_images.npy')

# # Load data of label 
# labels = pd.read_csv('datasets/ps4_trainvalid_labels.csv', index_col=0)

# Get the first 100 image
images = images[:100]

# Save all these images to a file
for i in range(100):
    file_name = 'images/image{}.png'.format(i)
    plt.imsave(file_name, images[i].reshape(64, 64))

