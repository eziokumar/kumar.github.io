<section class="timeline">
  <ul>
    <li>
      <div class="timeline-item">
        <h4 class="item-title">Diploma in Information Techonology</h4>
        <span class="item-period">2018</span>
        <span class="item-small">Quest International University Perak</span>
        <p class="item-description">Major in Website Development, Website Design and C/C++ Programming</p>
        <p class="item-description">Grade 2.82CGPA</p>
      </div>
    </li>
    <li>
      <div class="timeline-item">
        <h4 class="item-title">Sijil Pelajaran Malaysia (SPM)</h4>
        <span class="item-period">2015</span>
        <span class="item-small">Sekolah Menengah Kebangsaan Jalan Pasir Puteh</span>
        <p class="item-description">Major in Mathematics and Sciences</p>
        <p class="item-description">Grade C/2nd Class Lower</p>
      </div>
    </li>
    <li>
      <div class="timeline-item">
        <h4 class="item-title">Frontend Developer</h4>
        <span class="item-period">2019</span>
        <span class="item-small">LA Studios - Shopify Expert</span>
        <p class="item-description">Shopify UI/UX Designer<br><i>Using HTML, CSS, SCSS, JavaScript, & jquery programming language to design a responsive and good looking website under Shopify.</i></p>
      </div>
    </li>
    <li>
      <div class="timeline-item">
        <h4 class="item-title">Web Programmer</h4>
        <span class="item-period">2018</span>
        <span class="item-small">Searchneasy SDN BHD</span>
        <p class="item-description">Website Template Integration<br><i>To design a website using HTML, CSS, JavaScript, and PHP programming language according to the website design giving by the customer.</i></p>

        <p class="item-description">Web content development & Responsive Migration<br><i>To develop website content and mobile responsive according to the different size of mobile screens resolution and also desktop screens resolution.</i></p>

        <p class="item-description">Website Migration & Website upgrade<br> <i>To upgrade an existing website to the next level package using MySQL Workbench application and FileZilla without losing and information from the website.</i></p>
      </div>
    </li>
    <li>
      <div class="timeline-item">
        <h4 class="item-title">Computer Technician</h4>
        <span class="item-period">2016</span>
        <span class="item-small">B Online Cybercafe</span>
        <p class="item-description">Server Maintenance<br><i>Performs general cleaning and minor maintenance duties in maintaining library building, adjacent walks and grounds, and equipment in clean, orderly and functional condition.</i></p>

        <p class="item-description">Troubleshooting the PC Problems<br><i>Installing software or hardware, troubleshooting different computer issues, determining and installing appropriate security measures, configuring computer networks.</i></p>

        <p class="item-description">Replacing Hardware <br> <i>Maintaining and repairing equipment.</i></p>
      </div>
    </li>
  </ul>
</section>

<script>
  (function() {

  'use strict';

  // define variables
  var items = document.querySelectorAll(".timeline li");

  // check if an element is in viewport
  // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
  function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function callbackFunc() {
    for (var i = 0; i < items.length; i++) {
      if (isElementInViewport(items[i])) {
        items[i].classList.add("in-view");
      }
    }
  }

  // listen for events
  window.addEventListener("load", callbackFunc);
  window.addEventListener("resize", callbackFunc);
  window.addEventListener("scroll", callbackFunc);

})();
</script>