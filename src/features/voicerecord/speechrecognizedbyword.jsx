import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SpeechRecognitionByWord = () => {
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
        axios.get('http://localhost:4650/test1')
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
        };

        recognitionRef.current.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0])
                .map((result) => result.transcript)
                .join(' ');
            const words = transcript.split(' ');
            const spelledOutWords = words.map(word => word.split('').join(' '));
            setSpokenWords(spelledOutWords);
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
            'en-US': text?.en_US || '',
            'te-IN': text?.te_IN || '',
            'hi-IN': text?.hi_IN || ''
        };

        const splitText = Object.values(predefinedTexts).map(t => t.split(' ')).flat();

        let newGreenCount = 0;
        let newRedCount = 0;
        let newGreenWords = [];
        let newRedWords = [];

        const newRecognizedWords = spokenWords.map((word) => {
            const originalWord = word.replace(/ /g, '');
            if (splitText.includes(originalWord.toLowerCase())) {
                newGreenCount++;
                newGreenWords.push(originalWord);
                return { word, color: 'green', match: 'Matched' };
            } else {
                newRedCount++;
                newRedWords.push(originalWord);
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
                totalcount: greenCount+redCount,
                greenWords: greenWords,
                redWords: redWords,
                name: localstoragedata
            };
            console.log("recognizedData :: ", recognizedData)
            axios({
                method: 'post',
                url: 'http://localhost:4650/speechrecognizedbyword',
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
            <h1>Speech Recognition</h1>
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

export default SpeechRecognitionByWord;
