import { Buffer } from "https://cdn.jsdelivr.net/npm/buffer-es6@4.9.2/+esm";

const inputElement = document.getElementById("file");
const warning = document.querySelector("#warning");

inputElement.addEventListener("change", handleFiles);

function handleFiles() {
  const file = this.files[0]; 
  if (file.type == "application/json"){
      new Response(file).json().then((json) =>{
          warning.style.visibility = "hidden";
          document.querySelector("#container").style.visibility = "unset";
          // console.log(json);
          if(!("thread_path" in json)){
            warning.style.visibility = "unset";
            return;
          }
          document.querySelector("#title").innerText = json.title;
          const messagesContainer = document.querySelector("#messages"); 
          messagesContainer.replaceChildren();

          json.messages = json.messages.reverse();
          let senderTracker = "", dateTracker="";
          let perspective = json.participants[json.participants.length-1].name;
          
          for(const message of json.messages){
              // console.log(message);
            const messageContent = document.createElement("div");
            if(perspective == message.sender_name) 
              messageContent.classList.add("right");
            else
              messageContent.classList.add("left");
            const sender = document.createElement("strong");
            if(senderTracker !== message.sender_name) {
              sender.innerText = message.sender_name;
              sender.classList.add("sender");
              senderTracker = message.sender_name;
            }

            const content = document.createElement("p");
            let buff = Buffer.from(message.content, 'latin1');
            message.content = buff.toString("utf-8");
            content.innerText = message.content;
            content.classList.add("message");

            const reaction = document.createElement("p");
            if(message.reactions && Array.isArray(message.reactions)) {
                for(const reac of message.reactions) {
                    // console.log(message.reactions[0].reaction)
                    let react = Buffer.from(reac.reaction, 'latin1');
                    reac.reaction = react.toString("utf-8");
                    reaction.classList.add("reaction");
                    reaction.innerText = reac.reaction;
                }
            }

            const date = document.createElement("small")
            const readableDate = new Intl.DateTimeFormat(navigator.language, {month: "short", year: "numeric", day: "numeric", hour: "numeric", minute: "numeric"}).format(new Date(message.timestamp_ms));
            if(dateTracker !== readableDate) {
              date.innerText = readableDate;
              date.classList.add("date");
              dateTracker = readableDate;
            }
          
            messageContent.appendChild(sender);
            messageContent.appendChild(content);
            messageContent.appendChild(reaction);
            messageContent.appendChild(date);
            
            messagesContainer.appendChild(messageContent);
          }
          console.log(json)
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        })
      } else {
        warning.style.visibility = "unset";
      }
      // console.log(file)
    }