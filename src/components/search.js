import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function SearchBar(props) {
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (props.onSearch) {
      props.onSearch(searchText,searchType);
      setSearchPerformed(true);
    }
    navigate(`/search-profile?${searchType}=${searchText}`);
  };
  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
    if (props.onSearchTypeChange) {
      props.onSearchTypeChange(event);
    }
  };
  
  return (
    <div className="navbar-nav ml-auto">
      <form className="form-inline my-2 my-lg-0 mx-auto" onSubmit={(e) => {e.preventDefault(); handleSearch();}}>
        <input
          className="form-control mr-sm-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className="form-check form-check-inline">
        <input 
            className="form-check-input" 
            type="radio" 
            name="searchType" 
            id="searchByEmail" 
            value="email"
            checked={searchType === "email"}
            onChange={handleSearchTypeChange}
          />
          <label className="form-check-label" htmlFor="searchByEmail">Search by Email</label>
        </div>
        <div className="form-check form-check-inline">
        <input 
            className="form-check-input" 
            type="radio" 
            name="searchType" 
            id="searchByCertificate" 
            value="certificate"
            checked={searchType === "certificate"}
            onChange={handleSearchTypeChange}
        />

          <label className="form-check-label" htmlFor="searchByCertificate">Search by Certificate</label>
        </div>
        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
