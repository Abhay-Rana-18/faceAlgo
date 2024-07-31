import * as faceapi from 'face-api.js';

// Helper function to load an image from a URL
function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.crossOrigin = 'anonymous'; // Add this line
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
    });
}


export async function findMostSimilarFace(unknownImageSrc: string, knownFacesData: any) {
    if (typeof window === 'undefined') {
        return;
    }

    // Load face-api.js models
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

    // Load the unknown face image
    const unknownFaceImage = await loadImage(unknownImageSrc);

    // const unknownFaceImage = document.createElement('img');
    // unknownFaceImage.src = unknownImageSrc;

    // Load known faces images
    const knownFacesImages = await Promise.all(
        knownFacesData.map(async (faceData: any) => {
            return await loadImage(faceData.imageUrl);
        })
    );

    // Detect face descriptor for the unknown face
    const unknownFaceDetection = await faceapi.detectSingleFace(unknownFaceImage).withFaceLandmarks().withFaceDescriptor();
    const unknownFaceDescriptor = unknownFaceDetection?.descriptor;
    // console.log("Unknown face descriptor:", unknownFaceDescriptor);

    // Detect face descriptors for known faces
    const knownFacesDescriptors = await Promise.all(
        knownFacesImages.map(async (img: HTMLImageElement) => {
            const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            return detection?.descriptor;
        })
    );
    // console.log("Known faces descriptors:", knownFacesDescriptors);

    // Check if descriptors are defined
    if (!unknownFaceDescriptor) {
        console.log('Unknown face descriptor not found');
        return [];
    }
    if (!Array.isArray(knownFacesDescriptors) || knownFacesDescriptors.length === 0) {
        console.log('Known faces descriptors not found or empty');
        return [];
    }

    // Compute distances between the unknown face descriptor and known face descriptors
    let bestMatches: number[] = [];
    let bestMatchDistances: number[] = [];
    knownFacesDescriptors.forEach((knownFaceDescriptor, index) => {
        let distance: number = 1;
        if (unknownFaceDescriptor && knownFaceDescriptor) {
            distance = faceapi.euclideanDistance(knownFaceDescriptor, unknownFaceDescriptor);
        }

        bestMatches.push(index);
        bestMatchDistances.push(distance);
    });

    // Sort the matches based on distance from most similar to less similar
    let sortedMatches: number[] = [];
    let n = bestMatchDistances.length;
    let check: boolean[] = new Array(n).fill(true);
    for (let j = 0; j < n; j++) {
        let index = -1;
        let min = Infinity;
        for (let i = 0; i < n; i++) {
            if (check[i] && bestMatchDistances[i] < min) {
                index = i;
                min = bestMatchDistances[i];
            }
        }
        if (min === Infinity) {
            break;
        } else {
            sortedMatches.push(index);
            check[index] = false;
        }
    }

    // Get the data of the 5 most similar faces
    const mostSimilarFaces = sortedMatches.slice(0, 5).map((index) => knownFacesData[index]);
    console.log('Most similar faces:', mostSimilarFaces);

    return mostSimilarFaces;
}
