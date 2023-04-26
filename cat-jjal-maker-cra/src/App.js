import logo from './logo.svg';
import './App.css';
import React from 'react';
import Title from './components/title';

 const jsonLocalStorage = {
        setItem: (key, value) => {
          localStorage.setItem(key, JSON.stringify(value));
        },
        getItem: (key) => {
          return JSON.parse(localStorage.getItem(key));
        },
      };

      const fetchCat = async (text) => {
        const OPEN_API_DOMAIN = "https://cataas.com";
        const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
        const responseJson = await response.json();
        return `${OPEN_API_DOMAIN}/${responseJson.url}`;
      };

      console.log("야옹");


      const Form=({updateMainCat})=>{

        const [value,setValue]=React.useState('');
        const [errorMessage,setErrorMessage]=React.useState("")
        const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);

        function handelInputChange(e){
          const userValue=e.target.value;
          setErrorMessage("");
          if (includesHangul(userValue)){
            setErrorMessage("한글은 입력할 수 없습니다.");
          } 
          setValue(userValue.toUpperCase());
        }

        function handleFormSubmit(e){
          e.preventDefault();
          setErrorMessage("");

          if(value===''){
            setErrorMessage("빈 값으로 만들 수 없습니다.");
            return;
          }
          updateMainCat(value);
        }

        return (
          <form onSubmit={handleFormSubmit}>
            <input type="text" name="name" placeholder="영어 대사를 입력해주세요" value={value} onChange={handelInputChange}/>
            <button type="submit">생성</button>
            <p style={{color:"red"}}>{errorMessage}</p>
          </form>
        );
      };

      function CatItem(props){
        return (
          <li>
            <img src={props.img} style={{width:"150px"}}/>
          </li>
        )
      }


      function Favorites({ favorites }){
        if (favorites.length===0){
          return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>
        }

        return (
          <ul className="favorites">
            {
              favorites.map(cat=><CatItem img={cat} key={cat}/>)
            }
          </ul>
        )
      }

      const MainCard=({img, onHeartClick, alreadyFavorite})=>{
        const heartIcon=alreadyFavorite? "🤍": "💖";

        return (
          <div className="main-card">
            <img
              src={img}
              alt="고양이"
              width="400"
            />
            <button onClick={onHeartClick}>{heartIcon}</button>
          </div>
        )
      }


      const App= ()=>{
        const CAT1 = "https://cataas.com/cat/HSENVDU4ZMqy7KQ0/says/react";
        const CAT2 = "https://cataas.com/cat/BxqL2EjFmtxDkAm2/says/inflearn";
        const CAT3 = "https://cataas.com/cat/18MD6byVC1yKGpXp/says/JavaScript";

        const [counter,setCounter]=React.useState(()=>{
          return jsonLocalStorage.getItem('counter');
        })
        const [mainCat,setMainCat]=React.useState(CAT1);
        const [favorites, setFavorites]=React.useState(()=>{
          return jsonLocalStorage.getItem('favorites')||[]
        });

        const alreadyFavorite=favorites.includes(mainCat)

        async function setInitialCat() {
          const newCat = await fetchCat('First Cat');
          setMainCat(newCat);
        }

        React.useEffect(()=>{
          setInitialCat();
        },[]) // 두번째 인자가 업데이트 될 때마다 불림
        // setInitialCat();

        async function updateMainCat(value){
          const newCat = await fetchCat(value);

          setMainCat(newCat);
          
          setCounter ((prev)=>{
            const nextCounter=prev+1;
            jsonLocalStorage.setItem('counter',nextCounter);
            return nextCounter;
          })
        };

        function handleHeartClick() {
          const nextFavorites=[...favorites,mainCat];
          setFavorites(nextFavorites); //[CAT1,CAT2,CAT3]
          jsonLocalStorage.setItem('favorites',nextFavorites);
        }

        const counterTitle=counter===null?"":counter+"번째 ";
        return (
          <div>        
            <Title>{counterTitle} 고양이 가라사대</Title>
            <Form updateMainCat={updateMainCat} />
            <MainCard img={mainCat} onHeartClick={handleHeartClick} alreadyFavorite={alreadyFavorite}/>
            <Favorites favorites={favorites}/>
          </div>
        )
      }

export default App;
