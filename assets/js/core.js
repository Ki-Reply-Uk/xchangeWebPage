var Exchange = function() {

    let bugLeft = '4';                
    let gameOver = false;
    let userWon = true;
    let pauseTimer = false;
    
    var uiHelperEasyPieChart = function(){
        jQuery('.js-pie-chart').easyPieChart({
            barColor: jQuery(this).data('bar-color') ? jQuery(this).data('bar-color') : '#777777',
            lineWidth: jQuery(this).data('line-width') ? jQuery(this).data('line-width') : 3,
            size: jQuery(this).data('size') ? jQuery(this).data('size') : '80',
            scaleColor: jQuery(this).data('scale-color') ? jQuery(this).data('scale-color') : false
        });
    };

    return {
        bugLeft: bugLeft,

        gameOver: gameOver,

        userWon : userWon,

        initHelper: function(helper) {
            switch (helper) {
                case 'easy-pie-chart':
                    uiHelperEasyPieChart();
                    break;
                default:
                    return false;
            }
        },
        initHelpers: function(helpers) {
            if (helpers instanceof Array) {
                for(var index in helpers) {
                    Exchange.initHelper(helpers[index]);
                }
            } else {
                Exchange.initHelper(helpers);
            }
        },

        checkNewGameForm: function () {
            const name = $('#name').val().trim();
            const company = $('#company').val().trim();
            const email = $('#email').val().trim();
            const btnStartGame = $('#btnStartGame');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (name && company && email && emailPattern.test(email)) {
                btnStartGame.prop('disabled', false);
            } else {
                btnStartGame.prop('disabled', true);
            }
        },

        newGamePopup: function(){
             
             var newGameModal = $('#newGameModal'); // Get the modal
             var span = $('.close'); // Get the <span> element that closes the modal
             var btnStartGame = $('#btnStartGame');
             
             
             newGameModal.show();
             $('#name, #company, #email').on('input', this.checkNewGameForm);

             // When the user clicks on Start Game
             btnStartGame.on('click',function()
             {
                $('#gamerName').text($('#name').val());
                Exchange.startTimer();
                newGameModal.hide(false);
                sendStart()
             });   

            // When the user clicks on x, close the modal
             span.on('click', function() {
                newGameModal.hide();
             });

             // When the user clicks anywhere outside of the modal, close it
             $(window).on('click', function(event) {
                 if ($(event.target).is(newGameModal)) {
                    newGameModal.hide();
                 }
             });
        },
    
        gameOverPopUp: function(){
            var gameOverModal = $('#gameOverModal'); // Get the modal
            var span = $('.close'); // Get the <span> element that closes the modal
            var btnReset = $('#btnReset');
            gameOverModal.show();

            // When the user clicks on Reset
            btnReset.on('click',function(){
                sendReset()
            });

            // When the user clicks on x, close the modal
            span.on('click', function() {
                gameOverModal.hide();
            });

            // When the user clicks anywhere outside of the modal, close it
            $(window).on('click', function(event) {
                if ($(event.target).is(gameOverModal)) {
                    gameOverModal.hide();
                }
            });
        },

        gameWonModal: function(){
            
            var successModal = $('#successModal'); // Get the modal
            var span = $('.close'); // Get the <span> element that closes the modal
            var btnNewGame = $('#btnNewGame');

            successModal.show();
            $('#gameWonMessage').text("Game won - time taken: " + $('#countup').text()); 

            // When the user clicks on New Game
            btnNewGame.on('click', function(){
                sendReset()
                localStorage.clear()
            });

            // When the user clicks on x, close the modal
            span.on('click', function() {
                successModal.hide();
            });

            // When the user clicks anywhere outside of the modal, close it
            $(window).on('click', function(event) {
                if ($(event.target).is(successModal)) {
                    successModal.hide();
                }
            });
        },

        startTimer:function(){
            
            const targetTime = new Date().getTime() + 10 * 60 * 1000; // Set the target time for the countdown
            localStorage.setItem('targetTime', targetTime); // Store the target time in local storage

            // Update the timer display
            //updateTimerDisplay();
            Exchange.updateTimer();
        },

        pauseCounter:function(){
            pauseTimer = !pauseTimer; //Set bool to pause the timer
        },

        updateTimer:function(){
            if (!pauseTimer) {
              // Get the target time from local storage
              const targetTime = localStorage.getItem('targetTime');
          
              if (targetTime) {
                // Calculate the remaining time
                const now = new Date().getTime();
                const remainingTime = Math.max(0, targetTime - now);
          
                // Convert remaining time to minutes, seconds, and milliseconds
                const minutes = Math.floor(remainingTime / (1000 * 60));
                const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
                const milliseconds = Math.floor((remainingTime % 1000));
          
                const millisecondsText = milliseconds.toString().padStart(3, '0').slice(0, 2); // Ensure milliseconds are displayed with two digits
                const timerText = `${minutes}:${seconds.toString().padStart(2, '0')}:${millisecondsText}`;
                // document.getElementById('countup').textContent
                if ($('#countup').text() !== timerText) {
                    $('#countup').text(timerText);
                }
          
                // Check if the target time is reached
                if (remainingTime <= 0) {
                  $('#countup').text('Game over'); // Display "Game Over"
                  Exchange.gameOverPopUp(); // Call the function to show the game over pop-up
                  localStorage.removeItem('targetTime'); // Remove the target time from local storage
                }
              } else {
                  $('#countup').text('Game over'); // Display "Game Over" if there is no target time
              }
            }
            // Update using requestAnimationFrame
            setTimeout(Exchange.updateTimer, 10);
            //requestAnimationFrame(Exchange.updateTimer);
        },

        readJsonFile:function(){

            const accessToken = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6IldkRm9qemk1V2QtOTRZM0ZmYmJqclktZXRoZWRXNmhfdUVUaGFlZlZpYjQiLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9iMDAzNjdlMi0xOTNhLTRmNDgtOTRkZS03MjQ1ZDQ1YzA5NDcvIiwiaWF0IjoxNzE2NTQ2OTcxLCJuYmYiOjE3MTY1NDY5NzEsImV4cCI6MTcxNjYzMzY3MSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhXQUFBQXN3N3dBMUxWVUM5SmFsMUI2cHBrRDl3UkVPL2ZycHJiSXNqb3BjTFIrQm1CY0dYVXIxWjFPRUYwZHBONnFPRm1EeHRLR0VMQXZuN0tDZ2FHWnRWeVlKanBBVzFNQ3F6ajZ5UVJYdkk1NzE0PSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggRXhwbG9yZXIiLCJhcHBpZCI6ImRlOGJjOGI1LWQ5ZjktNDhiMS1hOGFkLWI3NDhkYTcyNTA2NCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiU2FtcGF0aCIsImdpdmVuX25hbWUiOiJTZW50aGlsIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMmEwNDo0YTQzOjk2Y2Y6ZjRhMjo2NWJhOjk4Zjg6NTQ0MjozMjg0IiwibmFtZSI6IlNlbnRoaWwgU2FtcGF0aCIsIm9pZCI6ImMzMTlmNmI4LTI1YWItNGNmMi1iYWJjLTcyYjA3MzhhZGQyYiIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS00MTczNjUyMjktMzk5NjU5MTgwLTE3MTQ3NzUwODEtMjc5OTY3IiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDAxRTEzQkZBRDkiLCJyaCI6IjAuQVFzQTRtY0RzRG9aU0UtVTNuSkYxRndKUndNQUFBQUFBQUFBd0FBQUFBQUFBQUNFQUpFLiIsInNjcCI6IkRldmljZU1hbmFnZW1lbnRBcHBzLlJlYWRXcml0ZS5BbGwgRGV2aWNlTWFuYWdlbWVudENvbmZpZ3VyYXRpb24uUmVhZFdyaXRlLkFsbCBEZXZpY2VNYW5hZ2VtZW50TWFuYWdlZERldmljZXMuUmVhZFdyaXRlLkFsbCBGaWxlcy5SZWFkV3JpdGUgSWRlbnRpdHlQcm92aWRlci5SZWFkLkFsbCBJZGVudGl0eVByb3ZpZGVyLlJlYWRXcml0ZS5BbGwgSWRlbnRpdHlSaXNrRXZlbnQuUmVhZC5BbGwgSWRlbnRpdHlSaXNrRXZlbnQuUmVhZFdyaXRlLkFsbCBJZGVudGl0eVJpc2t5VXNlci5SZWFkLkFsbCBJZGVudGl0eVJpc2t5VXNlci5SZWFkV3JpdGUuQWxsIElkZW50aXR5VXNlckZsb3cuUmVhZC5BbGwgSWRlbnRpdHlVc2VyRmxvdy5SZWFkV3JpdGUuQWxsIG9wZW5pZCBwcm9maWxlIFNpdGVzLlJlYWQuQWxsIFVzZXIuTWFuYWdlSWRlbnRpdGllcy5BbGwgVXNlci5SZWFkIGVtYWlsIiwic3ViIjoiVFF2NlU0bjhybHVLUmdiYXZranNGYTNqNmFCNkpsdFRBX1k1QWQzYVhrUSIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJFVSIsInRpZCI6ImIwMDM2N2UyLTE5M2EtNGY0OC05NGRlLTcyNDVkNDVjMDk0NyIsInVuaXF1ZV9uYW1lIjoicy5zYW1wYXRoQHJlcGx5LmNvbSIsInVwbiI6InMuc2FtcGF0aEByZXBseS5jb20iLCJ1dGkiOiJaWEZCQlQ0WnJFMkItdUdaUklJM0FBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2NjIjpbIkNQMSJdLCJ4bXNfc3NtIjoiMSIsInhtc19zdCI6eyJzdWIiOiJnU0pieF9fUXFsUC1NOUo0LVVxMV9iU2xLel9RZkJLYVVCekxJclNpZEVBIn0sInhtc190Y2R0IjoxNDA2Mjc1ODg1LCJ4bXNfdGRiciI6IkVVIn0.VMCY0D-CE0U-LE6INkme2Svq34SwtXHiLLoH9XWExRSU6sbW3HzgrURbcRyIkiCfznqvmCs7MSjZ1gDQ4uQ0uaPNvlVf9PeHOI9o2H2Ae_5NJ4Ziiny9HvkcsIbU1ZJIIxIUJ8e49BNFaM9jlwaXC9IDUkVQXPSMV3uTb7QJD5Q00rHf3V8T1hSSpLnhykd2jRxGBEIT79eVD9-KNhR-KNxGkkEUYOHctu0SiAQu04SKdbwwZIMppNiSG5GxJDmXB3hMJQDqWlP5CtHaY7fvOo-reqt5KGlrRju-CrZCFd8kCuycpgtYj0Hr-RI9ByDj3VwcR3HJhKBQ2beJEYpWVw'
            const sharedLink = 'https://reply-my.sharepoint.com/personal/k_gandhi_reply_com/_layouts/15/download.aspx?UniqueId=be8b0671eabe4173b94cb69fc99bdd48&e=V2zd0O';
            const encodedLink = btoa(sharedLink); 
            const fileUrl = `https://graph.microsoft.com/v1.0/shares/u!${encodedLink}/root/content`;
            
            return $.ajax({
                    url: fileUrl,
                    method: 'GET',
                    headers: {
                        'content-type' : 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
        },

        updateJsonFile:function(fileContent){
            const accessToken = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6IldkRm9qemk1V2QtOTRZM0ZmYmJqclktZXRoZWRXNmhfdUVUaGFlZlZpYjQiLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9iMDAzNjdlMi0xOTNhLTRmNDgtOTRkZS03MjQ1ZDQ1YzA5NDcvIiwiaWF0IjoxNzE2NTQ2OTcxLCJuYmYiOjE3MTY1NDY5NzEsImV4cCI6MTcxNjYzMzY3MSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhXQUFBQXN3N3dBMUxWVUM5SmFsMUI2cHBrRDl3UkVPL2ZycHJiSXNqb3BjTFIrQm1CY0dYVXIxWjFPRUYwZHBONnFPRm1EeHRLR0VMQXZuN0tDZ2FHWnRWeVlKanBBVzFNQ3F6ajZ5UVJYdkk1NzE0PSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggRXhwbG9yZXIiLCJhcHBpZCI6ImRlOGJjOGI1LWQ5ZjktNDhiMS1hOGFkLWI3NDhkYTcyNTA2NCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiU2FtcGF0aCIsImdpdmVuX25hbWUiOiJTZW50aGlsIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMmEwNDo0YTQzOjk2Y2Y6ZjRhMjo2NWJhOjk4Zjg6NTQ0MjozMjg0IiwibmFtZSI6IlNlbnRoaWwgU2FtcGF0aCIsIm9pZCI6ImMzMTlmNmI4LTI1YWItNGNmMi1iYWJjLTcyYjA3MzhhZGQyYiIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS00MTczNjUyMjktMzk5NjU5MTgwLTE3MTQ3NzUwODEtMjc5OTY3IiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDAxRTEzQkZBRDkiLCJyaCI6IjAuQVFzQTRtY0RzRG9aU0UtVTNuSkYxRndKUndNQUFBQUFBQUFBd0FBQUFBQUFBQUNFQUpFLiIsInNjcCI6IkRldmljZU1hbmFnZW1lbnRBcHBzLlJlYWRXcml0ZS5BbGwgRGV2aWNlTWFuYWdlbWVudENvbmZpZ3VyYXRpb24uUmVhZFdyaXRlLkFsbCBEZXZpY2VNYW5hZ2VtZW50TWFuYWdlZERldmljZXMuUmVhZFdyaXRlLkFsbCBGaWxlcy5SZWFkV3JpdGUgSWRlbnRpdHlQcm92aWRlci5SZWFkLkFsbCBJZGVudGl0eVByb3ZpZGVyLlJlYWRXcml0ZS5BbGwgSWRlbnRpdHlSaXNrRXZlbnQuUmVhZC5BbGwgSWRlbnRpdHlSaXNrRXZlbnQuUmVhZFdyaXRlLkFsbCBJZGVudGl0eVJpc2t5VXNlci5SZWFkLkFsbCBJZGVudGl0eVJpc2t5VXNlci5SZWFkV3JpdGUuQWxsIElkZW50aXR5VXNlckZsb3cuUmVhZC5BbGwgSWRlbnRpdHlVc2VyRmxvdy5SZWFkV3JpdGUuQWxsIG9wZW5pZCBwcm9maWxlIFNpdGVzLlJlYWQuQWxsIFVzZXIuTWFuYWdlSWRlbnRpdGllcy5BbGwgVXNlci5SZWFkIGVtYWlsIiwic3ViIjoiVFF2NlU0bjhybHVLUmdiYXZranNGYTNqNmFCNkpsdFRBX1k1QWQzYVhrUSIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJFVSIsInRpZCI6ImIwMDM2N2UyLTE5M2EtNGY0OC05NGRlLTcyNDVkNDVjMDk0NyIsInVuaXF1ZV9uYW1lIjoicy5zYW1wYXRoQHJlcGx5LmNvbSIsInVwbiI6InMuc2FtcGF0aEByZXBseS5jb20iLCJ1dGkiOiJaWEZCQlQ0WnJFMkItdUdaUklJM0FBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2NjIjpbIkNQMSJdLCJ4bXNfc3NtIjoiMSIsInhtc19zdCI6eyJzdWIiOiJnU0pieF9fUXFsUC1NOUo0LVVxMV9iU2xLel9RZkJLYVVCekxJclNpZEVBIn0sInhtc190Y2R0IjoxNDA2Mjc1ODg1LCJ4bXNfdGRiciI6IkVVIn0.VMCY0D-CE0U-LE6INkme2Svq34SwtXHiLLoH9XWExRSU6sbW3HzgrURbcRyIkiCfznqvmCs7MSjZ1gDQ4uQ0uaPNvlVf9PeHOI9o2H2Ae_5NJ4Ziiny9HvkcsIbU1ZJIIxIUJ8e49BNFaM9jlwaXC9IDUkVQXPSMV3uTb7QJD5Q00rHf3V8T1hSSpLnhykd2jRxGBEIT79eVD9-KNhR-KNxGkkEUYOHctu0SiAQu04SKdbwwZIMppNiSG5GxJDmXB3hMJQDqWlP5CtHaY7fvOo-reqt5KGlrRju-CrZCFd8kCuycpgtYj0Hr-RI9ByDj3VwcR3HJhKBQ2beJEYpWVw'
            const sharedLink = 'https://reply-my.sharepoint.com/personal/k_gandhi_reply_com/_layouts/15/download.aspx?UniqueId=be8b0671eabe4173b94cb69fc99bdd48&e=V2zd0O';
            const encodedLink = btoa(sharedLink);
            const updateUrl = `https://graph.microsoft.com/v1.0/shares/u!${encodedLink}/root/content`;

            return $.ajax({
                       url: updateUrl,
                       method: 'PUT',
                       headers: {
                           'Authorization': `Bearer ${accessToken}`,
                           'Content-Type': 'application/json'  
                       },
                       data: JSON.stringify(fileContent)
                   });
       },

       addNewGamerDetails: async function(){
            try {
                const fileContent = await Exchange.readJsonFile();

                let newuser = {};
                newuser["Playername"] = $('#name').val();
                newuser["Companyname"] = $('#company').val();
                newuser["Time"] = "";
                newuser["Email-Address"] = $('#email').val();
                newuser["Finished"] = false;
                fileContent.push(newuser);

                const fileUpdateResponse = await Exchange.updateJsonFile(fileContent);
                console.log('New Gamer details added successfully');
            }
            catch(error){
                console.error("Exception:-",error);
            }
        },

        updateGamerTime : async function(Time, Finished){
            try{
                const fileContent = await Exchange.readJsonFile();

                fileContent.forEach(item => {
                    if(item["Email-Address"] === $('#email').val())
                    {
                        item["Time"] = Time;
                        item["Finished"] = Finished;
                    }
                });
                const fileUpdateResponse = await Exchange.updateJsonFile(fileContent);
                console.log('Gamer details updated successfully');
            }
            catch(error){
                console.error('Exception while updating',error);
            }
        }
    };
}();

const socket = new WebSocket('ws://localhost:8765');

socket.onopen = function() {
    console.log('WebSocket connection established');
};

socket.onmessage = function(event) {
    console.log('Message from server: ', event.data);
    if (event.data === "hard_refresh") {
        console.log('Performing hard refresh');
        window.location.href=window.location.href
        console.log('Hard refresh complete');
    }
};

socket.onclose = function() {
    console.log('WebSocket connection closed');
};

function sendStart() {
    const message = 'Game Started';
    socket.send(message);
    console.log('Message sent: ', message);
}

function sendReset() {
    const message = 'New Game';
    socket.send(message);
    console.log('Message sent: ', message);
}

function hardReload() {
    var url = window.location.href;
    if (url.indexOf('?') > -1) {
        url += '&_=' + new Date().getTime();
    } else {
        url += '?_=' + new Date().getTime();
    }
    window.location.href = url;
}
