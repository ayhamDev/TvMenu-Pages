class FloatingCallButton extends HTMLElement {
  constructor() {
    super();

    // Create shadow root
    const shadow = this.attachShadow({ mode: "open" });

    // Add styles to the shadow root
    const iconColor = this.getAttribute("data-icon-color") || "#ffffff"; // Default white icon color
    const bgColor = this.getAttribute("data-bg-color") || "#4CAF50"; // Default green background
    const style = document.createElement("style");
    style.textContent = `
      * {
        --btn-bg-color: ${bgColor};
        --btn-icon-color: ${iconColor};
      }

      .floating-call-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000000000000000;
      }

      .call-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: var(--btn-bg-color);
          color: var(--btn-icon-color);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
      }

      .call-button:hover {
          transform: scale(1.1);
      }

      .pulse {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          border: 2px solid #4CAF50;
          animation: pulse 1.5s infinite;
      }

      @keyframes pulse {
          0% {
              transform: scale(1);
              opacity: 1;
          }
          100% {
              transform: scale(1.5);
              opacity: 0;
          }
      }

      .tooltip {
          position: absolute;
          right: 70px;
          top: 50%;
          transform: translateY(-50%);
          background-color: white;
          color: #333;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 14px;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          opacity: 0;
          transition: opacity 0.3s ease;
      }

      .floating-call-button:hover .tooltip {
          opacity: 1;
      }
    `;
    shadow.appendChild(style);

    // Add HTML structure to the shadow root
    const wrapper = document.createElement("div");
    wrapper.classList.add("floating-call-button");
    wrapper.innerHTML = `
      <button class="call-button" aria-label="Call us">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19.95 21q-3.125 0-6.175-1.362t-5.55-3.863t-3.862-5.55T3 4.05q0-.45.3-.75t.75-.3H8.1q.35 0 .625.238t.325.562l.65 3.5q.05.4-.025.675T9.4 8.45L6.975 10.9q.5.925 1.187 1.787t1.513 1.663q.775.775 1.625 1.438T13.1 17l2.35-2.35q.225-.225.588-.337t.712-.063l3.45.7q.35.1.575.363T21 15.9v4.05q0 .45-.3.75t-.75.3"/>
        </svg>
        <div class="pulse"></div>
      </button>
      <div class="tooltip">Click to call us!</div>
    `;

    shadow.appendChild(wrapper);

    // Get the attributes from the custom element

    const tel = this.getAttribute("data-tel") || "+01001577302"; // Default phone number

    // Handle the click event
    wrapper.querySelector(".call-button").addEventListener("click", () => {
      window.location.href = `tel:${tel}`;
    });
  }
}
class FloatingWhatsAppWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Fetch data attributes from the light DOM
    const phoneNumber = this.getAttribute("data-tel") || "1234567890";
    const message =
      this.getAttribute("data-message") ||
      "Hello! How can we assist you today?";
    const btnColor = this.getAttribute("data-btn-color") || "#25D366"; // Default WhatsApp green
    const iconColor = this.getAttribute("data-icon-color") || "white";
    // Add styles to shadow DOM
    const style = document.createElement("style");
    style.textContent = `
          :host {
              --whatsapp-green: #25D366;
              --whatsapp-dark-green: #075E54;
              --chat-bg: #E5DDD5;
              --message-bg: #DCF8C6;
          }
          * {
            color-scheme: light;
            color: black;
          }
          .whatsapp-widget {
              position: fixed;
              bottom: 20px;
              right: 20px;
              z-index: 1000;
          }

          .whatsapp-button {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              background-color: ${btnColor} !important;
              color: ${iconColor} !important;
              border: none;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              transition: transform 0.3s ease;
          }

          .whatsapp-button:hover {
              transform: scale(1.1);
          }

          .chat-window {
              position: absolute;
              bottom: 80px;
              right: 0;
              width: 300px;
              background-color: white;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              opacity: 0;
              transform: translateY(20px);
              transition: opacity 0.3s ease, transform 0.3s ease;
              pointer-events: none;
          }

          .chat-window.active {
              opacity: 1;
              transform: translateY(0);
              pointer-events: all;
          }

          .chat-header {
              background-color: var(--whatsapp-dark-green);
              color: white;
              padding: 10px;
              font-weight: bold;
          }

          .chat-body {
              height: 200px;
              background-color: var(--chat-bg);
              padding: 10px;
              overflow-y: auto;
          }

          .chat-input {
              display: flex;
              padding: 10px;
              background-color: white;
          }

          .chat-input input {
              flex-grow: 1;
              background-color: #f3f3f3;
              border-radius: 20px;
              padding: 10px;
              margin-right: 10px;
          }

          .chat-input button {
              background-color: var(--whatsapp-green);
              color: white;
              border: none;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
          }

          .pulse {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              border-radius: 50%;
              border: 2px solid var(--whatsapp-green);
              animation: pulse 2s infinite;
          }

          @keyframes pulse {
              0% {
                  transform: scale(1);
                  opacity: 1;
              }
              100% {
                  transform: scale(1.5);
                  opacity: 0;
              }
          }

          .message {
              background-color: var(--message-bg);
              border-radius: 10px;
              padding: 8px;
              margin-bottom: 8px;
              max-width: 80%;
              word-wrap: break-word;
              animation: messageAppear 0.3s ease;
          }

          @keyframes messageAppear {
              from {
                  opacity: 0;
                  transform: translateY(10px);
              }
              to {
                  opacity: 1;
                  transform: translateY(0);
              }
          }
      `;
    this.shadowRoot.appendChild(style);

    // Add HTML structure
    const wrapper = document.createElement("div");
    wrapper.classList.add("whatsapp-widget");
    wrapper.innerHTML = `
          <button class="whatsapp-button" aria-label="Open WhatsApp chat" id="whatsappButton">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <div class="pulse"></div>
          </button>
          <div class="chat-window" id="chatWindow">
              <div class="chat-header">WhatsApp Chat</div>
              <div class="chat-body" id="chatBody"></div>
              <div class="chat-input">
                  <input type="text" id="messageInput" placeholder="Type a message..." aria-label="Type a message">
                  <button id="sendMessageButton" aria-label="Send message">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                  </button>
              </div>
          </div>
      `;
    this.shadowRoot.appendChild(wrapper);

    // Select DOM elements
    const whatsappButton = this.shadowRoot.getElementById("whatsappButton");
    const chatWindow = this.shadowRoot.getElementById("chatWindow");
    const sendMessageButton =
      this.shadowRoot.getElementById("sendMessageButton");
    const messageInput = this.shadowRoot.getElementById("messageInput");

    let isOpen = false;
    let hasGreeted = false;

    // Toggle chat window visibility
    whatsappButton.addEventListener("click", () => {
      isOpen = !isOpen;
      chatWindow.classList.toggle("active", isOpen);
      if (isOpen && !hasGreeted) {
        setTimeout(() => {
          this.addReceivedMessage(message);
          hasGreeted = true;
        }, 300);
      }
    });

    // Handle message sending
    sendMessageButton.addEventListener("click", () => {
      this.sendMessage();
    });

    messageInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.sendMessage();
      }
    });

    // Add a received message to the chat window
    this.addReceivedMessage = (text) => {
      const messageElement = document.createElement("div");
      messageElement.textContent = text;
      messageElement.classList.add("message");
      this.shadowRoot.getElementById("chatBody").appendChild(messageElement);
      this.shadowRoot.getElementById("chatBody").scrollTop =
        this.shadowRoot.getElementById("chatBody").scrollHeight;
    };

    // Send message by opening WhatsApp link
    this.sendMessage = () => {
      const message = messageInput.value.trim();
      if (message) {
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
          message
        )}`;
        window.open(whatsappUrl, "_blank");
        messageInput.value = "";
      }
    };
  }
}

// Define the custom element
customElements.define("widget-call", FloatingCallButton);
customElements.define("widget-whatsapp", FloatingWhatsAppWidget);
