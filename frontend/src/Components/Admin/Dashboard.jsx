import React,{useState,useEffect} from 'react'
import AppInfoBox from '../AppInfoBox';
import LatestUploads from '../LatestUploads';
import { useNotification } from '../../Hooks';
import { getAppInfo } from '../../api/admin';
import MostRatedMovies from '../MostRatedMovies';

export default function Dashboard() {
  const { updateNotification } = useNotification();
  const [appInfo, setAppInfo] = useState({movieCount: 0,reviewCount: 0,userCount: 0});
  
  const fetchAppInfo = async () => {
    const { appInfo, error } = await getAppInfo();
    if (error) return updateNotification("error", error);
    setAppInfo({ ...appInfo });
  };

  useEffect(() => {
    fetchAppInfo();
  }, []);
  return(
    <div className="grid grid-cols-3 gap-5 mt-5">
      <AppInfoBox title="Total Uploads" subtitle={appInfo.movieCount?.toLocaleString()}/>
      <AppInfoBox title="Total Reviews" subtitle={appInfo.reviewCount?.toLocaleString()}/>
      <AppInfoBox title="Total Users" subtitle={appInfo.userCount?.toLocaleString()}/>
      <LatestUploads/>
      <MostRatedMovies/>
    </div>
  );
}
