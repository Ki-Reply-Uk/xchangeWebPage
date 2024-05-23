var Exchange = function() {

    let bugLeft = '4';                
    let gameOver = false;
    let userWon = false;
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

        newGamePopup: function(){
             
             var newGameModal = $('#newGameModal'); // Get the modal
             var span = $('.close'); // Get the <span> element that closes the modal
             var btnStartGame = $('#btnStartGame');
             newGameModal.show();

             // When the user clicks on Start Game
             btnStartGame.on('click',function()
             {
                $('#gamerName').text($('#name').val());
                Exchange.startTimer();
                newGameModal.hide(false);
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

            // When the user clicks on New Game
            btnNewGame.on('click', function(){

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
            
            const targetTime = new Date().getTime() + 1 * 60 * 1000; // Set the target time for the countdown
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

            const accessToken = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6IlJ3NDY5VlZrM3BNbmRwMmFOM3lOaDY0OVhzQkZjUHA2aWlacXhSVWg0ZVkiLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8yZmIwNTE1Yy0xNWU4LTQ0MTctYmNhMi04MDVhNThhOGNlOGMvIiwiaWF0IjoxNzE2Mzc0NzYzLCJuYmYiOjE3MTYzNzQ3NjMsImV4cCI6MTcxNjQ2MTQ2MywiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhXQUFBQUlua0ozYjR2NWNQd2RQNGQzN1l1Szl1aThONDZVUGFzU3RocTM5NU1WM3pYd2hsMVAxcDRvckIyaHU3b1hZc3UiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkdyYXBoIEV4cGxvcmVyIiwiYXBwaWQiOiJkZThiYzhiNS1kOWY5LTQ4YjEtYThhZC1iNzQ4ZGE3MjUwNjQiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IlZhbmNlIiwiZ2l2ZW5fbmFtZSI6IkFkZWxlIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiOTQuMzEuMTAzLjgwIiwibmFtZSI6IkFkZWxlIFZhbmNlIiwib2lkIjoiZmQzNzg1MTQtMGQyOC00Mjg2LTkxNmItNDJmYTdjMmQyMmJlIiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDAxRDM1RjA5RUIiLCJyaCI6IjAuQVVZQVhGR3dMLWdWRjBTOG9vQmFXS2pPakFNQUFBQUFBQUFBd0FBQUFBQUFBQUM4QUJFLiIsInNjcCI6Im9wZW5pZCBwcm9maWxlIFVzZXIuUmVhZCBlbWFpbCBGaWxlcy5SZWFkV3JpdGUuQWxsIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoiV3VNR1pvUmhZZnBIX2dLSzZ6VTdvRDdNSmt4SFU5b1Jvcm9GU1VuODBsYyIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJOQSIsInRpZCI6IjJmYjA1MTVjLTE1ZTgtNDQxNy1iY2EyLTgwNWE1OGE4Y2U4YyIsInVuaXF1ZV9uYW1lIjoiQWRlbGVWQDZnY2ZiZC5vbm1pY3Jvc29mdC5jb20iLCJ1cG4iOiJBZGVsZVZANmdjZmJkLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6InQtaEppOEtNUTBhRWN2Y3ZwMUk1QUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfY2MiOlsiQ1AxIl0sInhtc19zc20iOiIxIiwieG1zX3N0Ijp7InN1YiI6IkR5MkdhQ3Y5VG1ZNEFzbW5taFZNUjlSTkQySk9fSjN2d0hKWmZkSElIZ2sifSwieG1zX3RjZHQiOjE2NDMwOTg3MjB9.ZGzt4LzpFDr0XIUymBl2lts-SDzqQ4-eiBDyJPu22S0SwQdEw7GyFctX-yKs6m_UNgttYPrPcAFpENFbOGtdlw6s_kTsVoVj-GkMUCSkZKtRM4axrza9nxrvdlRfdimaI62vXsavhSxY7FdX-ZF3XN53kBtvejuq4axbZUQ5gzif8jfu2mZSeZr9SvGQV6MmzjixLUrQUnMWei6MeMIXueMYPYVk4NhXLbWniKXg90rPSNLv3eiTUznMRuwZBjQFjEGQZG95Un-vOzxeEx_Hf5w_6KdR41gmiG9-621DifXjqoKFsl9IECzwP3jA7fJnAc95eYGuV4XZ9IVmJPJPrg'
            const sharedLink = 'https://6gcfbd-my.sharepoint.com/:u:/g/personal/s_hausenblas_6gcfbd_onmicrosoft_com/Ede283773ZFAgPVzTa5ijOUB_TNQxGtCWJiXRH2xF3R9RA';
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
            const accessToken = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6IlJ3NDY5VlZrM3BNbmRwMmFOM3lOaDY0OVhzQkZjUHA2aWlacXhSVWg0ZVkiLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8yZmIwNTE1Yy0xNWU4LTQ0MTctYmNhMi04MDVhNThhOGNlOGMvIiwiaWF0IjoxNzE2Mzc0NzYzLCJuYmYiOjE3MTYzNzQ3NjMsImV4cCI6MTcxNjQ2MTQ2MywiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhXQUFBQUlua0ozYjR2NWNQd2RQNGQzN1l1Szl1aThONDZVUGFzU3RocTM5NU1WM3pYd2hsMVAxcDRvckIyaHU3b1hZc3UiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkdyYXBoIEV4cGxvcmVyIiwiYXBwaWQiOiJkZThiYzhiNS1kOWY5LTQ4YjEtYThhZC1iNzQ4ZGE3MjUwNjQiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IlZhbmNlIiwiZ2l2ZW5fbmFtZSI6IkFkZWxlIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiOTQuMzEuMTAzLjgwIiwibmFtZSI6IkFkZWxlIFZhbmNlIiwib2lkIjoiZmQzNzg1MTQtMGQyOC00Mjg2LTkxNmItNDJmYTdjMmQyMmJlIiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDAxRDM1RjA5RUIiLCJyaCI6IjAuQVVZQVhGR3dMLWdWRjBTOG9vQmFXS2pPakFNQUFBQUFBQUFBd0FBQUFBQUFBQUM4QUJFLiIsInNjcCI6Im9wZW5pZCBwcm9maWxlIFVzZXIuUmVhZCBlbWFpbCBGaWxlcy5SZWFkV3JpdGUuQWxsIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoiV3VNR1pvUmhZZnBIX2dLSzZ6VTdvRDdNSmt4SFU5b1Jvcm9GU1VuODBsYyIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJOQSIsInRpZCI6IjJmYjA1MTVjLTE1ZTgtNDQxNy1iY2EyLTgwNWE1OGE4Y2U4YyIsInVuaXF1ZV9uYW1lIjoiQWRlbGVWQDZnY2ZiZC5vbm1pY3Jvc29mdC5jb20iLCJ1cG4iOiJBZGVsZVZANmdjZmJkLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6InQtaEppOEtNUTBhRWN2Y3ZwMUk1QUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfY2MiOlsiQ1AxIl0sInhtc19zc20iOiIxIiwieG1zX3N0Ijp7InN1YiI6IkR5MkdhQ3Y5VG1ZNEFzbW5taFZNUjlSTkQySk9fSjN2d0hKWmZkSElIZ2sifSwieG1zX3RjZHQiOjE2NDMwOTg3MjB9.ZGzt4LzpFDr0XIUymBl2lts-SDzqQ4-eiBDyJPu22S0SwQdEw7GyFctX-yKs6m_UNgttYPrPcAFpENFbOGtdlw6s_kTsVoVj-GkMUCSkZKtRM4axrza9nxrvdlRfdimaI62vXsavhSxY7FdX-ZF3XN53kBtvejuq4axbZUQ5gzif8jfu2mZSeZr9SvGQV6MmzjixLUrQUnMWei6MeMIXueMYPYVk4NhXLbWniKXg90rPSNLv3eiTUznMRuwZBjQFjEGQZG95Un-vOzxeEx_Hf5w_6KdR41gmiG9-621DifXjqoKFsl9IECzwP3jA7fJnAc95eYGuV4XZ9IVmJPJPrg'
            const sharedLink = 'https://6gcfbd-my.sharepoint.com/:u:/g/personal/s_hausenblas_6gcfbd_onmicrosoft_com/Ede283773ZFAgPVzTa5ijOUB_TNQxGtCWJiXRH2xF3R9RA';
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