document.querySelectorAll(".carousel").forEach(function (carousel) {
  var track = carousel.querySelector(".carousel-track");
  var slides = Array.prototype.slice.call(carousel.querySelectorAll(".carousel-slide"));
  var prevBtn = carousel.querySelector(".carousel-btn.prev");
  var nextBtn = carousel.querySelector(".carousel-btn.next");
  var dotsWrap = carousel.parentElement.querySelector(".carousel-dots");
  var dots = [];

  function visibleCount() {
    var slideWidth = slides[0].getBoundingClientRect().width;
    if (!slideWidth) return 1;
    return Math.max(1, Math.round(track.clientWidth / slideWidth));
  }

  function pageCount() {
    return Math.max(1, Math.ceil(slides.length / visibleCount()));
  }

  function currentPage() {
    var width = track.clientWidth || 1;
    return Math.round(track.scrollLeft / width);
  }

  function goToPage(page) {
    var max = pageCount() - 1;
    page = Math.max(0, Math.min(max, page));
    track.scrollTo({ left: page * track.clientWidth, behavior: "smooth" });
  }

  function updateDots() {
    var page = currentPage();
    dots.forEach(function (d, i) { d.classList.toggle("active", i === page); });
  }

  function buildDots() {
    dotsWrap.innerHTML = "";
    dots = [];
    var count = pageCount();
    for (var p = 0; p < count; p++) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Đi tới nhóm ảnh " + (p + 1));
      (function (page) {
        dot.addEventListener("click", function () { goToPage(page); });
      })(p);
      dotsWrap.appendChild(dot);
      dots.push(dot);
    }
    updateDots();
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildDots, 150);
  });

  track.addEventListener("scroll", function () {
    window.requestAnimationFrame(updateDots);
  });

  prevBtn.addEventListener("click", function () { goToPage(currentPage() - 1); });
  nextBtn.addEventListener("click", function () { goToPage(currentPage() + 1); });

  buildDots();
});

var progressChart = document.querySelector(".progress-chart");
if (progressChart) {
  var chartLines = Array.prototype.slice.call(progressChart.querySelectorAll(".chart-line"));
  chartLines.forEach(function (line) {
    var length = line.getTotalLength();
    line.style.strokeDasharray = length;
    line.style.strokeDashoffset = length;
  });
  // Force the hidden state to paint before transitions are enabled, otherwise
  // the browser animates INTO this initial value instead of out of it.
  void progressChart.getBoundingClientRect();
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      chartLines.forEach(function (line) {
        line.style.transition = "stroke-dashoffset 5s linear";
      });
    });
  });

  function revealChart() {
    progressChart.classList.add("in-view");
    chartLines.forEach(function (line) { line.style.strokeDashoffset = "0"; });
  }

  if ("IntersectionObserver" in window) {
    var chartObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealChart();
          chartObserver.unobserve(progressChart);
        }
      });
    }, { threshold: 0.4 });
    chartObserver.observe(progressChart);
  } else {
    revealChart();
  }
}
