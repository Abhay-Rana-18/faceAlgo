import * as faceapi from 'face-api.js';

export async function findMostSimilarFace(unknownImageSrc: string, knownFacesData: any) {
    if (typeof window === 'undefined') {
        return;
    }
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

    const unknownFaceImage = document.createElement('img');
    unknownFaceImage.src = unknownImageSrc;

    const knownFacesImages = knownFacesData.map((faceData: any) => {
        const img = document.createElement('img');
        img.src = faceData.imageUrl;
        return img;
    });

    const unknownFaceDetection = await faceapi.detectSingleFace(unknownFaceImage).withFaceLandmarks().withFaceDescriptor();
    const unknownFaceDescriptor = unknownFaceDetection?.descriptor;
    const knownFacesDescriptors = await Promise.all(
        knownFacesImages.map(async (img: any) => {
            const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            return detection?.descriptor;
        })
    );
     // Check if unknownFaceDescriptor is defined
     if (!unknownFaceDescriptor) {
        console.log('Unknown face descriptor not found');
    }

    // Check if knownFacesDescriptors is an array and has elements
    if (!Array.isArray(knownFacesDescriptors) || knownFacesDescriptors.length === 0) {
        console.log('Known faces descriptors not found or empty');
    }
    console.log("1");
    let bestMatches: number[] = []; // Array to store the best matches
    let bestMatchDistances: number[] = []; // Array to store the distances of the best matches
    knownFacesDescriptors.forEach((knownFaceDescriptor, index) => {
        let distance: number = 1;
        if (unknownFaceDescriptor) {
            distance = faceapi.euclideanDistance(knownFaceDescriptor, unknownFaceDescriptor);
        }
        
        bestMatches.push(index);
        bestMatchDistances.push(distance);
        
    });
    console.log("2");

    // Sort the matches based on distance from most similar to less similar
    let sortedMatches: number[] = [];
    let n = bestMatchDistances.length;
    console.log(n);
    console.log(bestMatchDistances);
    let check: boolean[] = new Array(n).fill(true);
    for (let j = 0; j < n; j++) {
        let index = -1;
        let min = 10;
        for (let i = 0; i < n; i++) {
            if (check[i] && bestMatchDistances[i] < min) {
                index = i;
                min = bestMatchDistances[i];
            }
        }
        if (min == 10) {
            break;
        }
        else {
            sortedMatches.push(index);
            check[index] = false;
        }
    }


    // Get the data of the 5 most similar faces
    const mostSimilarFaces =  sortedMatches.slice(0, 5).map((index) => knownFacesData[index]);
    console.log('Most similar faces:', mostSimilarFaces);
    return mostSimilarFaces; 
}
