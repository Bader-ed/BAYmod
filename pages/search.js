import Center from "../components/Center";
import Header from "../components/Header";
import ProductsGrid from "../components/ProductsGrid";
import Title from "../components/Title";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (q) {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data);
          setLoading(false);
        }).catch(error => {
          console.error("Failed to fetch search results:", error);
          setLoading(false);
          setSearchResults([]);
        });
    }
  }, [q]);

  return (
    <>
      <Header />
      <Center>
        <Title>Search results for &quot;{q}&quot;</Title>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {searchResults.length > 0 ? (
              <ProductsGrid products={searchResults} />
            ) : (
              <p>No products found matching your search term.</p>
            )}
          </>
        )}
      </Center>
    </>
  );
}
