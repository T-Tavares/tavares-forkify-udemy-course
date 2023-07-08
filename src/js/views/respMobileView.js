class respMobileView {
  searchSec() {
    // Search Variables
    const searchBar = document.querySelector('.search');
    const searchInput = searchBar.children.item(0);
    const searchBtn = searchBar.children.item(1);

    searchInput.placeholder = 'Search a recipe';
    searchBtn.children.item(1).innerHTML = '';
  }

  addHandlerRespMobile() {
    window.addEventListener('load', e => {
      if (window.innerWidth < 415) {
        this.searchSec();
      }
    });
  }
}

export default new respMobileView();
