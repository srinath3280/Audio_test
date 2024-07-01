import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SpeechRecognitionBySentence = () => {
    const [spokenWords, setSpokenWords] = useState([]);
    const [recognizedWords, setRecognizedWords] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [text, setText] = useState({});
    const [greenCount, setGreenCount] = useState(0);
    const [redCount, setRedCount] = useState(0);
    const [greenWords, setGreenWords] = useState([]);
    const [redWords, setRedWords] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('en-US');

    const recognitionRef = useRef(null);

    useEffect(() => {
        axios.get('http://localhost:4650/test')
            .then((res) => setText(res.data[0]))
            .catch((err) => console.error('Error fetching predefined texts:', err));
    }, []);

    useEffect(() => {
        recognitionRef.current = new window.webkitSpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onstart = () => {
            setIsListening(true);
        };
        recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };
        recognitionRef.current.onend = () => {
            setIsListening(false);
        }

        recognitionRef.current.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0])
                .map((result) => result.transcript)
                .join(' ');
            setSpokenWords(transcript.split(' '));
        };

        return () => {
            recognitionRef.current.stop();
        };
    }, []);

    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = selectedLanguage;
        }
    }, [selectedLanguage]);

    useEffect(() => {
        const predefinedTexts = {
            'en_US': text?.en_US || '',
            'te_IN': text?.te_IN || '',
            'hi_IN': text?.hi_IN || ''
        };

        const splitText = Object.values(predefinedTexts).map(t => t.split(' ')).flat();

        let newGreenCount = 0;
        let newRedCount = 0;
        let newGreenWords = [];
        let newRedWords = [];

        const newRecognizedWords = spokenWords.map((word) => {
            if (splitText.includes(word.toLowerCase())) {
                newGreenCount++;
                newGreenWords.push(word);
                return { word, color: 'green', match: 'Matched' };
            } else {
                newRedCount++;
                newRedWords.push(word);
                return { word, color: 'red', match: 'Unmatched' };
            }
        });

        if (JSON.stringify(newRecognizedWords) !== JSON.stringify(recognizedWords)) {
            setRecognizedWords(newRecognizedWords);
            setGreenCount(newGreenCount);
            setRedCount(newRedCount);
            setGreenWords(newGreenWords);
            setRedWords(newRedWords);
        }
    }, [spokenWords, text, recognizedWords]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
            sendRecognitionData();
        } else {
            recognitionRef.current.start();
        }
        setIsListening(!isListening);
    };

    const handleLanguageChange = (e) => setSelectedLanguage(e.target.value);

    const sendRecognitionData = () => {
        const localstoragedata = localStorage.getItem("name");
        if (localstoragedata) {
            const recognizedData = {
                greenCount: greenCount,
                redCount: redCount,
                totalCount: greenCount+redCount,
                greenWords: greenWords,
                redWords: redWords,
                name: localstoragedata
            };
            console.log("recognizedData :: ", recognizedData)
            axios({
                method: 'post',
                url: 'http://localhost:4650/speechrecognized',
                data: recognizedData
            }).then((res) => {
                alert(res.data.message)
                // console.log(res.data)
            }).catch((err) => {
                console.log(err)
            })
        }
    };

    return (
        <div>
            <h1>Speech Recognition By Sentence</h1>
            <select onChange={handleLanguageChange} value={selectedLanguage}>
                <option value='en-US'>English</option>
                <option value='te-IN'>Telugu</option>
                <option value='hi-IN'>Hindi</option>
            </select>
            <button onClick={toggleListening}>
                {isListening ? 'Stop Listening' : 'Start Listening'}
            </button>
            <div>
                <p>Predefined Text:</p>
                {
                    Object.entries(text)
                        .filter(([key, value]) => key !== 'id')
                        .map(([key, value]) => (
                            <div key={key}>
                                <p>{key}: {value}</p>
                            </div>
                        ))
                }
                {/* {Object.entries(text).map(([key, value]) => (
                    <div key={key}>
                        <p>{key}: {value}</p>
                    </div>
                ))} */}
            </div>
            <div>
                <p>Spoken Words:</p>
                {spokenWords.map((word, index) => (
                    <span key={index}>{word}&nbsp;</span>
                ))}
            </div>
            <div>
                <p>Recognized Words:</p>
                {recognizedWords.map(({ word, color }, index) => (
                    <span key={index} style={{ color }}>{word}&nbsp;</span>
                ))}
            </div>
            <div>
                <p>Green Words Count: {greenCount}</p>
                <p>Red Words Count: {redCount}</p>
                <p>Total Words Count: {greenCount + redCount}</p>
            </div>
            <div>
                <p>Correct spell words: {greenWords.join(", ")}</p>
                <p>Wrong spell words: {redWords.join(", ")}</p>
            </div>
        </div>
    );
};

export default SpeechRecognitionBySentence;












// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

// const SpeechRecognitionBySentence = () => {
//     const [spokenWords, setSpokenWords] = useState([]);
//     const [recognizedWords, setRecognizedWords] = useState([]);
//     const [isListening, setIsListening] = useState(false);

//     const [text,setText] = useState({});

//     const [greenCount, setGreenCount] = useState(0);
//     const [redCount, setRedCount] = useState(0);
//     const [greenWords, setGreenWords] = useState([]);
//     const [redWords, setRedWords] = useState([]);

//     const [selectedLanguage, setSelectedLanguage] = useState('en-US');
//     let predefinedTexts = {
//         'en-US':text?.en_US,
//         'te-IN':text?.te_IN,
//         'hi-IN':text?.hi_IN
//     }
//     // const predefinedTexts = {
//     //     'en-US': "these skills will allow you to read english language newspapers.",
//     //     'te-IN': "దయచేసి నన్ను ఈ చిరునామాకి తీసుకెళ్లండి.",
//     //     'hi-IN': "मैं अच्छी तरह से हिंदी नहीं बोलता।"
//     // };
//     const splitText = Object.values(predefinedTexts).map(text => text.split(" ")).flat();
//     const recognitionRef = useRef(null);

//     useEffect(()=>{
//         axios({
//             method:'get',
//             url:'http://localhost:4650/test'
//         }).then((res)=>{
//             // console.log(res.data)
//             setText(res.data[0])
//         })
//     },[])
//     console.log(text)

//     useEffect(() => {
//         recognitionRef.current = new window.webkitSpeechRecognition();
//         recognitionRef.current.continuous = true;
//         recognitionRef.current.interimResults = true;

//         recognitionRef.current.onstart = () => {
//             setIsListening(true);
//         };

//         recognitionRef.current.onerror = (event) => {
//             console.error('Speech recognition error:', event.error);
//             setIsListening(false);
//         };

//         recognitionRef.current.onend = () => {
//             setIsListening(false);
//         };

//         recognitionRef.current.onresult = (event) => {
//             const transcript = Array.from(event.results)
//                 .map((result) => result[0])
//                 .map((result) => result.transcript)
//                 .join('');

//             setSpokenWords(transcript.split(' '));
//         };

//         return () => {
//             recognitionRef.current.stop();
//         };
//     }, []);

//     useEffect(() => {
//         if (recognitionRef.current) {
//             recognitionRef.current.lang = selectedLanguage;
//         }
//     }, [selectedLanguage]);

//     useEffect(() => {
//         let newGreenCount = 0;
//         let newRedCount = 0;
//         let newGreenWords = [];
//         let newRedWords = [];

//         const newRecognizedWords = spokenWords.map((word) => {
//             if (splitText.includes(word.toLowerCase())) {
//                 newGreenCount++;
//                 newGreenWords.push(word);
//                 return { word: word, color: 'green', match: 'Matched' };
//             } else {
//                 newRedCount++;
//                 newRedWords.push(word);
//                 return { word: word, color: 'red', match: 'Unmatched' };
//             }
//         });

//         // Check if newRecognizedWords is different from recognizedWords before updating
//         if (JSON.stringify(newRecognizedWords) !== JSON.stringify(recognizedWords)) {
//             setRecognizedWords(newRecognizedWords);
//             setGreenCount(newGreenCount);
//             setRedCount(newRedCount);
//             setGreenWords(newGreenWords);
//             setRedWords(newRedWords);
//         }
//     }, [spokenWords, splitText, recognizedWords]);

//     const toggleListening = () => {
//         if (isListening) {
//             recognitionRef.current.stop();
//         } else {
//             recognitionRef.current.start();
//         }
//         setIsListening(!isListening);
//     };

//     const handleLanguageChange = (e) => {
//         setSelectedLanguage(e.target.value);
//     };

//     useEffect(() => {
//         const localstoragedata = localStorage.getItem("name")
//         console.log(localstoragedata)
//         if (localstoragedata != null) {
//             var recognizedData = {
//                 greenCount: greenCount,
//                 redCount: redCount,
//                 greenWords: greenWords,
//                 redWords: redWords,
//                 name:localstoragedata
//             }
//             axios({
//                 method: "POST",
//                 url: "http://localhost:4650/speechrecognized",
//                 data: recognizedData
//             })
//         }
//     }, [greenCount, redCount, greenWords, redWords])

//     return (
//         <div>
//             <h1>Speech Recognition</h1>
//             <select onChange={handleLanguageChange} value={selectedLanguage}>
//                 <option value='en-US'>English</option>
//                 <option value='te-IN'>Telugu</option>
//                 <option value='hi-IN'>Hindi</option>
//             </select>
//             <button onClick={toggleListening}>
//                 {isListening ? 'Stop Listening' : 'Start Listening'}
//             </button>
//             <div>
//                 <p>Predefined Text:</p>
//                 {Object.entries(predefinedTexts).map(([key, value]) => (
//                     <div key={key}>
//                         <p>{key}: {value}</p>
//                     </div>
//                 ))}
//             </div>
//             <div>
//                 <p>Spoken Words:</p>
//                 {spokenWords.map((word, index) => (
//                     <span key={index}>{word}&nbsp;</span>
//                 ))}
//             </div>
//             <div>
//                 <p>Recognized Words:</p>
//                 {recognizedWords.map(({ word, color }, index) => (
//                     <span key={index} style={{ color: color }}>{word}&nbsp;</span>
//                 ))}
//             </div>
//             <div>
//                 <p>Green Words Count: {greenCount}</p>
//                 <p>Red Words Count: {redCount}</p>
//                 <p>Total Words Count: {greenCount + redCount}</p>
//             </div>
//             <div>
//                 <p>Correct spell words : {greenWords.join(", ")}</p>
//                 <p>Wrong spell words : {redWords.join(", ")}</p>
//             </div>
//         </div>
//     );
// };

// export default SpeechRecognitionBySentence;