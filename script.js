document.querySelectorAll(".carousel").forEach(function (carousel) {
  var track = carousel.querySelector(".carousel-track");
  var slides = Array.prototype.slice.call(carousel.querySelectorAll(".carousel-slide"));
  var prevBtn = carousel.querySelector(".carousel-btn.prev");
  var nextBtn = carousel.querySelector(".carousel-btn.next");
  var dotsWrap = carousel.parentElement.querySelector(".carousel-dots");

  slides.forEach(function (_, i) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", "Đi tới ảnh " + (i + 1));
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", function () {
      slides[i].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
    dotsWrap.appendChild(dot);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function activeIndex() {
    var center = track.scrollLeft + track.clientWidth / 2;
    var closest = 0;
    var closestDist = Infinity;
    slides.forEach(function (slide, i) {
      var dist = Math.abs(slide.offsetLeft + slide.clientWidth / 2 - center);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    });
    return closest;
  }

  function updateDots() {
    var i = activeIndex();
    dots.forEach(function (d, idx) { d.classList.toggle("active", idx === i); });
  }

  track.addEventListener("scroll", function () {
    window.requestAnimationFrame(updateDots);
  });

  prevBtn.addEventListener("click", function () {
    var i = Math.max(0, activeIndex() - 1);
    slides[i].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  });
  nextBtn.addEventListener("click", function () {
    var i = Math.min(slides.length - 1, activeIndex() + 1);
    slides[i].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  });
});
