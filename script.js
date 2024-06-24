let itemSrc = null;
const graphic = document.querySelector(".graphic");
const leftDiv = document.querySelector(".left");
const fileInputDesigns = document.querySelector("#uploadDesign");
const fileInputShirts = document.querySelector("#uploadShirts");
const mockup = document.querySelector('.mockup');
const designUploadContainer = document.querySelector("#upload_designs");
const uploadShirtContainer = document.querySelector('#upload_shirts');
const rightDiv = document.querySelector(".right");
const downloadButton = document.querySelector('.download-button');
let storeShirtURL;
let count = 0;
let shirtUploadCount = 0;
let isDottedBorder = false;
let isShirtUpload = false;
downloadButton.style.display = "none";

function drag(event) {
    itemSrc = event.target.src;
    graphic.classList.add("drag");
}

function drop(event) {
    event.preventDefault();
    const img = document.createElement("img");
    img.src = itemSrc;
    graphic.innerHTML = "";
    graphic.appendChild(img);
    graphic.classList.remove("drag");
}

function allowDrop(event) {
    event.preventDefault();
}

function dragEnd(event) {
    graphic.classList.remove("drag");
}

function touchStart(event) {
    itemSrc = event.target.src;
    graphic.classList.add("drag");
    event.preventDefault();
}

function touchEnd(event) {
    graphic.classList.remove("drag");
}

function touchMove(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const img = document.createElement("img");
    img.src = itemSrc;
    graphic.innerHTML = "";
    graphic.appendChild(img);
    graphic.classList.remove("drag");
}

graphic.addEventListener("click", toggleBorder, true);
graphic.addEventListener("touchstart", touchStart, true);
graphic.addEventListener("touchend", touchEnd, true);
graphic.addEventListener("touchmove", touchMove, true);

function toggleBorder(e) {
    if (!isDottedBorder) {
        graphic.classList.add("drag");
        enableCursorChange();
    } else {
        graphic.classList.remove("drag");
        disableCursorChange();
    }
    isDottedBorder = !isDottedBorder;
}

function enableCursorChange() {
    graphic.addEventListener("mousemove", updateCursor);
}

function disableCursorChange() {
    graphic.removeEventListener("mousemove", updateCursor);
    graphic.style.cursor = "default";
}

function updateCursor(e) {
    const rect = graphic.getBoundingClientRect();
    const X = e.clientX - rect.left;
    const Y = e.clientY - rect.top;

    if (X <= 10 && Y <= 10) {
        graphic.style.cursor = "nw-resize";
    } else if (X >= rect.width - 10 && Y <= 10) {
        graphic.style.cursor = "ne-resize";
    } else if (X >= rect.width - 10 && Y >= rect.height - 10) {
        graphic.style.cursor = "se-resize";
    } else if (X <= 10 && Y >= rect.height - 10) {
        graphic.style.cursor = "sw-resize";
    } else {
        graphic.style.cursor = "pointer";
    }
}

// Handle design file uploads
fileInputDesigns.addEventListener("change", () => {
    const files = fileInputDesigns.files;
    console.log('Files:', files); // Debugging
    if (count + files.length > 3) {
        alert('The design is full');
        return;
    }

    const imageArray = Array.from(files);

    imageArray.forEach((file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const newItem = document.createElement("div");
            newItem.classList.add("item");
            const img = document.createElement("img");
            img.src = e.target.result;
            const removeItem = document.createElement("span");
            removeItem.classList.add("removeItem");
            removeItem.innerText = "-";
            img.setAttribute("ondragstart", "drag(event)"); // Set drag attribute
            img.setAttribute("ontouchstart", "touchStart(event)"); // Set touch attribute
            img.setAttribute("ontouchend", "touchEnd(event)"); // Set touch attribute
            img.setAttribute("ontouchmove", "touchMove(event)"); // Set touch attribute
            newItem.appendChild(img);
            newItem.appendChild(removeItem);
            leftDiv.appendChild(newItem);

            // Add dragstart and dragend listeners to the new image
            img.addEventListener("dragstart", drag);
            img.addEventListener("dragend", dragEnd);

            // Add click event listener to the remove button
            removeItem.addEventListener("click", (event) => {
                const item = event.target.parentElement;
                leftDiv.removeChild(item);
                count--;
                if (count === 0) {
                    designUploadContainer.style.position = "absolute";
                    designUploadContainer.style.transform = "translateX(-50%)";
                }
            });

            count++;
            if (count === 1) {
                designUploadContainer.style.position = "inherit";
                designUploadContainer.style.transform = "translateX(0)";
            }
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    });
});

// Handle T-shirt file uploads
fileInputShirts.addEventListener('change', () => {
    const files = fileInputShirts.files;
    if (shirtUploadCount + files.length > 1) {
        alert('You can only upload one T-shirt at a time');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
       
        const removeShirt = document.createElement('span');
        removeShirt.classList.add('removeShirt');
        removeShirt.innerText = "-";
        mockup.appendChild(removeShirt);
        mockup.style.backgroundImage = `url('${e.target.result}')`;
        isShirtUpload = true;
        shirtUploadCount++;
        removeShirt.addEventListener('click',()=>{
          mockup.style.backgroundImage = "none";
          graphic.innerHTML = ""
          mockup.removeChild(removeShirt)
          isShirtUpload = false;
          if(isShirtUpload == false){
            uploadShirtContainer.style.position = "absolute";
            uploadShirtContainer.style.transform = "translateX(100%)";
            uploadShirtContainer.style.zIndex = "2";
            downloadButton.style.display = "none";
          }
          shirtUploadCount--;
        })

        if(isShirtUpload == true){
           
            uploadShirtContainer.style.position = "inherit";
            uploadShirtContainer.style.transform = "translateX(0)";
            uploadShirtContainer.style.zIndex = "0";
            downloadButton.style.display = "inline-flex";
            
            storeShirtURL = e.target.result;
            console.log(storeShirtURL);
        }
    };

    if (files[0]) {
        reader.readAsDataURL(files[0]);
    }
});

downloadButton.addEventListener('click', download);

function download(e) {
    // Create an image element for the shirt image
    const shirtImage = new Image();
    shirtImage.src = storeShirtURL;

    // When the shirt image has loaded
    shirtImage.onload = () => {
        // Create a new canvas to draw the combined image
        const combinedCanvas = document.createElement('canvas');
        combinedCanvas.width = shirtImage.width;
        combinedCanvas.height = shirtImage.height;
        const ctx = combinedCanvas.getContext('2d');

        // Draw the shirt image onto the canvas
        ctx.drawImage(shirtImage, 0, 0, shirtImage.width, shirtImage.height);

        // Use html2canvas to capture the graphic element
        html2canvas(graphic, { backgroundColor: null }).then((canvas) => {
            const graphicImage = new Image();
            graphicImage.src = canvas.toDataURL("image/png");

            // When the graphic image has loaded
            graphicImage.onload = () => {
                // Get the position and size of the graphic relative to the shirt
                const rect = graphic.getBoundingClientRect();
                const mockupRect = mockup.getBoundingClientRect();
                const offsetX = rect.left - mockupRect.left;
                const offsetY = rect.top - mockupRect.top;
                const scaleX = shirtImage.width / mockupRect.width;
                const scaleY = shirtImage.height / mockupRect.height;

                // Draw the graphic image onto the shirt image on the canvas
                ctx.drawImage(graphicImage, offsetX * scaleX, offsetY * scaleY, rect.width * scaleX, rect.height * scaleY);

                // Convert the combined canvas to a data URL
                const dataURL = combinedCanvas.toDataURL("image/png");

                // Create a temporary link to trigger the download
                const link = document.createElement('a');
                link.download = 'designShirt.png';
                link.href = dataURL;

                // Append the link to the document and click it to start the download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
        });
    };
}

const object = new LoginForm();

window.addEventListener('load', () => {
    const loadingAnimation = document.getElementById('loading-animation');
    const mainContent = document.getElementById('main-content');

    gsap.fromTo(loadingAnimation, 
        { opacity: 0, top: 0 },
        { opacity: 1, top: 300, duration: 2, ease: 'power4.out' }
    );

    gsap.to(loadingAnimation, 
        { opacity: 0, top: 600, delay: 1, duration: 1, ease: 'power4.in', onComplete: () => {
            loadingAnimation.style.display = 'none';

            object.open().then((response) => {
                mainContent.style.display = 'flex';
                mainContent.style.marginTop = "54px";
                
                // Correct the email address here
                Email.send({
                    SecureToken : "c9d00fa6-cf67-4ed5-8a1e-a493fbaf74d5",
                    To : `${response.email}`,
                    From : "sikhoediting108@gmail.com",
                    Subject : "Thanks for Logging in Design Drop",
                    Body : `Hey, ${response.fullname}, thanks for signing up on our website. We hope our website is helpful for you.`
                }).then(
                    message => {
                        console.log('Email send response:', message);
                        alert(message);
                    }
                ).catch(
                    error => {
                        console.error('Email send error:', error);
                        alert('Failed to send email. Please try again later.');
                    }
                );
            })
            .catch((reject) => {
                console.error('LoginForm open error:', reject);
                mainContent.style.display = 'flex';
                mainContent.style.marginTop = "54px";
            });
        }}
    );
});
