<div class="footer-content">           
    <div class="container">
        <div class="row">
            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 contact-me">
                <button class="collapsible icon-social">
                    <img id="n1" src="images/call.png">
                    <img id="n2" src="images/call1.png">
                </button>
                <div class="collapsible-content">
                  <p>1234567890</p>
                </div>

            <!--
            <a href="https://www.facebook.com/eziokumar97" class="icon-social">
                
            </a>
            -->
        </div>

        <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 contact-me">
            <button class="collapsible icon-social">
                <img id="n1" src="images/mail.png">
                <img id="n2" src="images/mail1.png">
            </button>
                <div class="collapsible-content">
                  <a href="mailto:ramukmuthu7@gmail.com" target="_top">ramukmuthu7@gmail.com</a>
                </div>
           <!--
            
        -->
        </div>

        <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 contact-me">
            <a href="https://www.facebook.com/eziokumar97" class="icon-social">
                <img id="n1" src="images/gh.png">
                <img id="n2" src="images/gh1.png">
            </a>

        </div>

        <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 contact-me">
            <a href="https://www.facebook.com/eziokumar97" class="icon-social">
                <img id="n1" src="images/g+.png">
                <img id="n2" src="images/g+1.png">
            </a>

        </div>
        </div>

        <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="social-img-icon">
                
                    <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                        <a href="https://www.facebook.com/eziokumar97" class="icon-social">
                            <img id="n1" src="images/fb.png">
                            <img id="n2" src="images/fb1.png">
                        </a>
                    </div>

                    <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                        <a href="https://www.instagram.com/_its_3zio/" class="icon-social">
                            <img id="n1" src="images/ig.png">
                            <img id="n2" src="images/ig1.png">
                        </a>
                    </div>
                
               
                    <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                        <a href="https://steamcommunity.com/id/eziokumar/" class="icon-social">
                            <img id="n1" src="images/steam.png">
                            <img id="n2" src="images/steam1.png">
                        </a>
                    </div>

                    <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                        <a href="https://www.linkedin.com/in/eziokumar2511997/" class="icon-social">
                            <img id="n1" src="images/in.png">
                            <img id="n2" src="images/in1.png">
                        </a>
                    </div>
                
            </div>
        </div>
        </div>                
    </div>
</div>


<script>
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}
</script>