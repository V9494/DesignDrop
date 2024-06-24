class LoginForm {
    constructor() {
        this.createAndOpen = this.createAndOpen.bind(this);
    }
    createAndOpen(response, reject) {
        // Create input elements
        this.inputFullname = document.createElement("input");
        this.inputFullname.id = "fullname";
        this.inputFullname.type = "text";
        this.inputFullname.setAttribute("name", "fullname");

        this.inputEmail = document.createElement("input");
        this.inputEmail.id = "email";
        this.inputEmail.type = "email";
        this.inputEmail.setAttribute("name", "email");

        this.inputUserName = document.createElement("input");
        this.inputUserName.id = "username";
        this.inputUserName.type = "text";
        this.inputUserName.setAttribute("name", "username");

        this.inputPassWord = document.createElement("input");
        this.inputPassWord.id = "password";
        this.inputPassWord.type = "password";
        this.inputPassWord.setAttribute("name", "password");

        // Create background overlay
        this.backgroundOverlay = document.createElement("div");
        this.backgroundOverlay.classList.add("backgroundOverlay");
        setTimeout(() => {
            this.backgroundOverlay.classList.add("open");
        }, 500);

        // Create form card
        this.formCard = document.createElement("div");
        this.formCard.classList.add("signup-form");

        // Create and append close icon
        this.closeIcon = document.createElement("div");
        this.closeIcon.innerText = "x";
        this.closeIcon.classList.add("close-icon");
        this.formCard.appendChild(this.closeIcon);
        this.formCard.innerHTML += `<h2>Sign Up</h2>`;

        // Create form
        this.form = document.createElement("form");
        this.form.id = "signupForm";
        this.formCard.appendChild(this.form); // Append the form to the formCard

        // Append input elements to the form
        this.form.appendChild(this.createFormGroup("Full Name", this.inputFullname));
        this.form.appendChild(this.createFormGroup("Email", this.inputEmail));
        this.form.appendChild(this.createFormGroup("Username", this.inputUserName));
        this.form.appendChild(this.createFormGroup("Password", this.inputPassWord));

        // Append sign up button
        const signUpButton = document.createElement("button");
        signUpButton.type = "submit";
        signUpButton.classList.add("signup-button");
        signUpButton.innerText = "Sign Up";
        this.form.appendChild(signUpButton);

       
        // Event listener for form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission
            // Validate input fields
            if (this.inputFullname.value.trim() === '' || 
                this.inputEmail.value.trim() === '' || 
                this.inputUserName.value.trim() === '' || 
                this.inputPassWord.value.trim() === '') {
               
                console.log("Please fill in all fields.");
                return;
            }

            // Capture form data and pass it to the response function
            response({
                fullname: this.inputFullname.value,
                email: this.inputEmail.value,
                username: this.inputUserName.value,
                password: this.inputPassWord.value
            });

            // Close the form
            this.close();
        });
       
        this.backgroundOverlay.addEventListener('click',(e)=>{
            if(e.target.innerText === "x"){
                this.close();
                reject("Rejected");
            }
        })

        // Append form card to background overlay
        document.body.appendChild(this.backgroundOverlay);
        this.backgroundOverlay.appendChild(this.formCard);

    }

    createFormGroup(labelText, inputElement) {
        const formGroup = document.createElement("div");
        formGroup.classList.add("form-group");

        const label = document.createElement("label");
        label.htmlFor = inputElement.id;
        label.innerText = labelText;

        formGroup.appendChild(label);
        formGroup.appendChild(inputElement);

        return formGroup;
    }

    open() {
        return new Promise((resolve, reject) => {
            this.createAndOpen(resolve, reject);
        });
    }

    close() {
        this.backgroundOverlay.remove();
    }
}

