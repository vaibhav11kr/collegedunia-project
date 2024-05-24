import React, { useState, useEffect, useCallback, useMemo } from "react";
import Header from "./components/Header";

const App = () => {
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    const response = await fetch("./college_data.json");
    const result = await response.json();
    return result;
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      const initialData = await fetchData();
      setData(initialData.slice(0, 10));
    };
    loadInitialData();
  }, [fetchData]);

  const loadMoreData = async () => {
    const newPage = page + 1;
    const newData = await fetchData();
    const nextDataChunk = newData.slice(newPage * 10, newPage * 10 + 10);

    if (nextDataChunk.length === 0) {
      setHasMore(false);
    } else {
      setData((prevData) => [...prevData, ...nextDataChunk]);
      setPage(newPage);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollableElement = document.documentElement;
      const scrollTop = scrollableElement.scrollTop;
      const windowHeight = window.innerHeight;
      const scrollHeight = scrollableElement.scrollHeight;

      const reachedBottom = scrollTop + windowHeight >= scrollHeight - 200; // 200 pixels from the bottom

      if (reachedBottom && hasMore) {
        loadMoreData();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadMoreData]);

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (typeof aValue === "string" && !isNaN(aValue)) {
          aValue = parseFloat(aValue.replace(/[^0-9.-]+/g, ""));
        }
        if (typeof bValue === "string" && !isNaN(bValue)) {
          bValue = parseFloat(bValue.replace(/[^0-9.-]+/g, ""));
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const filteredData = sortedData.filter((item) =>
    item.college_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full">
      <Header />
      <h1 className="text-2xl font-bold mb-4 flex justify-center items-center h-8">
        College Dunia Ranking Table Dummy
      </h1>
      <div className="p-8 flex flex-col justify-center items-center">
        <input
          type="text"
          placeholder="Search by college name"
          value={searchTerm}
          onChange={handleSearch}
          className="mb-4 p-2 border border-gray-300 rounded"
        />
        <table className="w-[90%] border-collapse">
          <thead>
            <tr className="h-10 bg-[#78BEC3] text-white text-left p-2 text-xs">
              <th className="border-slate-400 border w-[10%] p-2">CD Rank</th>
              <th className="border-slate-400 border w-[38%] p-2">Colleges</th>
              <th className="border-slate-400 border w-[13%] p-2">
                Course Fees
                <button className="pl-2 pr-1" onClick={() => handleSort('college_fees', 'ascending')}>↑</button>
                <button onClick={() => handleSort('college_fees', 'descending')}>↓</button>
              </th>
              <th className="border-slate-400 border w-[13%] p-2">
                Placements
                <button className="pl-2 pr-1" onClick={() => handleSort('college_placement', 'ascending')}>↑</button>
                <button onClick={() => handleSort('college_placement', 'descending')}>↓</button>
              </th>
              <th className="border-slate-400 border w-[13%] p-2">
                User Reviews
                <button className="pl-2 pr-1" onClick={() => handleSort('college_review_rating', 'ascending')}>↑</button>
                <button onClick={() => handleSort('college_review_rating', 'descending')}>↓</button>
              </th>
              <th className="border-slate-400 border w-[13%] p-2">
                CD Reviews
                <button className="pl-2 pr-1 cursor-pointer" onClick={() => handleSort('college_rating', 'ascending')}>↑</button>
                <button onClick={() => handleSort('college_rating', 'descending')}>↓</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => (
              <tr key={idx} className="h-36 text-sm">
                <td className="border border-slate-400 text-left p-2 relative -top-12">
                  #{item.college_rank}
                </td>
                <td className="border border-slate-400 text-left p-2">
                  <p className="text-[#6ACFBA] font-bold">
                    {item.college_name}
                  </p>
                  <p className="text-xs">{item.college_location}</p>
                  <p className="text-orange-500 font-semibold pt-4">
                    College - Program: {item.college_course}
                  </p>
                  <span className="flex justify-between items-center">
                    <button className="pt-6 text-orange-500 font-semibold"> → Apply</button>
                    <button className="pt-6 text-teal-500 font-semibold"> ↓ Download Brochure</button>
                    <div className="flex pt-6 justify-center items-center">
                      <input type="checkbox" name="compare" id="compare" />
                      <label htmlFor="compare" className="pl-2">Add to compare</label>
                    </div>
                  </span>
                </td>
                <td className="border border-slate-400 text-left p-2 ">
                  <p className="text-[#6ACFBA] font-bold"> {item.college_fees}</p>
                </td>
                <td className="border border-slate-400 text-left p-2">
                  <p className="text-[#6ACFBA] font-bold"> {item.college_placement}</p>
                </td>
                <td className="border border-slate-400 text-left p-2">
                  <p className="text-[#121212] font-bold"> {item.college_review_rating} / 10</p>
                </td>
                <td className="border border-slate-400 text-left p-2">
                  <p className="text-[#161616] font-bold"> {item.college_rating} / 10</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!hasMore && <p className="text-center mt-4">No more data to load</p>}
    </div>
  );
};

export default App;
