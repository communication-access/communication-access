const ws = new WebSocket("ws://localhost:3000");

ws.onmessage = (event) => {
  const newMessages = JSON.parse(event.data);
  displayMessages(newMessages);
};

function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value;

  if (message.trim() !== "") {
    const sender = "You"; // For simplicity, assuming the sender is the user

    const messageObject = {
      sender,
      message,
      timestamp: new Date().toLocaleString(),
    };

    ws.send(JSON.stringify(messageObject));
  }
}

function displayMessages(newMessages) {
  const messagesDiv = document.getElementById("messages");

  newMessages.forEach((msg) => {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    messageDiv.innerHTML = `<strong>${msg.sender}:</strong> ${msg.message} <span class="timestamp">${msg.timestamp}</span>`;
    messagesDiv.appendChild(messageDiv);
  });

  // Scroll to the bottom to show the latest messages
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function downloadConversation() {
  const messagesDiv = document.getElementById("messages");
  const messages = Array.from(messagesDiv.children).map((messageDiv) => {
    const sender = messageDiv
      .querySelector("strong")
      .textContent.replace(":", "");
    const message = messageDiv.textContent.replace(`${sender}:`, "").trim();
    const timestamp = messageDiv.querySelector(".timestamp").textContent;
    return { sender, message, timestamp };
  });

  if (messages.length > 0) {
    const conversationText = messages
      .map((msg) => `${msg.sender}: ${msg.message} (${msg.timestamp})`)
      .join("\n");
    const blob = new Blob([conversationText], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "conversation.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    alert("No conversation to download.");
  }
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}
