import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Loader from '@/components/shared/Loader';
import PostPreview from '@/components/shared/PostPreview';
import { Tab, TabContext, TabList, TabPanel } from '@/components/shared/Tabs';
import UserPreview from '@/components/shared/UserPreview';
import { useSearchTop } from '@/react-query/queriesAndMutations';
import SearchLatest from '@/components/shared/SearchLatest';
import SearchMedia from '@/components/shared/SearchMedia';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/react-query/queryKeys';
import { useNavigate } from 'react-router-dom';

function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputText, setInputText] = useState<string>(searchParams.get('q') || '');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams?.get('q')?.length || 0 > 0) {
      navigate(`/search?${searchParams.toString()}`);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleEnterKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputText.length > 0) {
      const prev = searchParams.get('q');
      setSearchParams({q: inputText});

      if (prev === inputText) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SEARCH_TOP],
        });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SEARCH_LATEST],
        });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SEARCH_MEDIA],
        });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SEARCH_PEOPLE],
        });
      }
    }
  };

  return (
    <div className="flex flex-col w-full post-list relative">
      <div className="flex sticky-bar top-0 flex-col z-10">
        <div className="w-full px-4 pt-2 pb-1">
          <div className="flex flex-row flex-1 bg-[#eff3f4] px-4 py-2 
          rounded-full items-center h-[42px] gap-4 border-[1px] has-[:focus]:bg-transparent
            has-[:focus]:border-blue has-[:focus]:text-blue">
            <SearchIcon />
            <input 
              type="text" 
              className="bg-transparent outline-none w-full flex-1 focus:text-black" 
              placeholder="Search" 
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleEnterKeydown}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExplorePage;