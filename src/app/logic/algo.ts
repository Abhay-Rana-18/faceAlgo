import * as faceapi from 'face-api.js';

export async function findMostSimilarFace(unknownImageSrc: string, knownFacesData: any) {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

    const unknownFaceImage = document.createElement('img');
    unknownFaceImage.src = unknownImageSrc;

    console.log(unknownImageSrc);

    const knownFacesImages = knownFacesData.map((faceData: any) => {
        const img = document.createElement('img');
        img.src = faceData.imageUrl;
        return img;
    });

    const unknownFaceDetection = await faceapi.detectSingleFace(unknownFaceImage).withFaceLandmarks().withFaceDescriptor();
    console.log("second");
    const unknownFaceDescriptor = unknownFaceDetection?.descriptor;

    const knownFacesDescriptors = await Promise.all(
        knownFacesImages.map(async (img: any) => {
            const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            return detection?.descriptor;
        })
    );

    let bestMatchDistance = 1; // Set to 1 (maximum distance) initially
    let bestMatchIndex = -1;

    knownFacesDescriptors.forEach((knownFaceDescriptor, index) => {
        let distance = 1;
        if (unknownFaceDescriptor) {
            distance = faceapi.euclideanDistance(knownFaceDescriptor, unknownFaceDescriptor);
        }
        if (distance < bestMatchDistance) {
            bestMatchDistance = distance;
            bestMatchIndex = index;
        }
    });

    const mostSimilarFace = knownFacesData[bestMatchIndex];
    console.log('Most similar face:', mostSimilarFace);
}

// Example usage
// const unknownImageData = { imageUrl: 'path_to_unknown_image' };
// const knownFacesData = [{ imageUrl: 'path_to_known_image_1' }, { imageUrl: 'path_to_known_image_2' }];

// findMostSimilarFace(unknownImageData, knownFacesData);
