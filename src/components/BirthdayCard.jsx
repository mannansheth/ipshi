"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../styles/BirthdayCard.css"
import { FaHeart, FaInfinity } from "react-icons/fa6"

const BirthdayCard = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowMessage(true), 800)
    } else {
      setShowMessage(false)
    }
  }, [isOpen])

  return (

      <div className="card-container">
        <div className={`birthday-card ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(!isOpen)}>
          <div className={`card-front ${isOpen ? "open" : ""}`} >
            <div className="card-decorations">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="sparkle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                >
                  ✨
                </div>
              ))}
            </div>
            <h2>Happy Birthday Ipshi!</h2>
            <p>Click to open your special card</p>
            <div className="cake-icon">🎂</div>
          </div>

          <div className={`card-inside ${!isOpen ? "notopen" : ""}`}>
            <div className="left-panel">
              <div className="birthday-message">
                {showMessage && (
                  <>
                    <h3>Hi Cutie,</h3>
                    <p>
                      Happy birthday and Happy nineteenth, my love.
                    </p> 
                    <p>
                      I dont know where to start but I just wanna tell you i am EXTREMELY grateful for you.
                      
                    </p>
                    <p>
                      Every single day, i feel so thankful that you looked in my direction, and i genuinely dont know what would my life be without you.
                      Thankyou so much for having the balls that i never had.
                      Thankyou for letting me be a part of your life.
                    </p>
                    <p>
                      I feel so special that i get to share my life and every single moment with you. 
                      From the moment i saw you on 15th October, 2023, i knew there was something special about you. 
                      I never got the courage to approach you and that is the biggest regret of my entire life.
                      I wonder where we may have been if i had the balls :(
                    </p>
                    <p>
                      I still remember how i awkward and shy i was on 4th Oct, 2024, the day we first met. The moment i saw you, i was MESMERIZED i was STRUCK by your beauty, no words came out my mouth. The drive after that was SO perfect and i absolutely love how well we bond on music. it is genuinely my favourite thing about us. Music bring us so close its crazy.
                    </p>
                    <p>
                      Its crazy how awkward i used to be when we first started talking, and to compare that to now is CRAZY. you met someone who was literally mute and has now been turned into an occasional yapper by his sweet girlfriend. i love the change you got in me. I love actively trying to be a better person for you and treat you the way a princess must be treated.
                    </p>
                    <p>
                      Ipshi you are the best person to ever enter my life and you have no idea how happy you make me.
                      Every single day that i get to spend with you is the best day of my life.
                      Today, we have completed exactly 300 days together, and i can confirm these have been the BEST period of my life.
                    </p>
                    <p>
                     You are genuinely the sweetest, prettiest, most interesting, entertaining, funny, HOT, beautiful, gorgeous girl ive ever seen and its crazy how comfortable i have gotten with you. The boy that was shy and did not open up to anyone, has an amazing woman in his life that he can share anyone with. 
                    </p>
                    <p>
                     IT IS CRAZY HOW OBSESSED YOU HAVE GOTTEN ME MITUDI. HOW??
                     The way my mood changes, and my facial expressions transform as soon as i look at you is CRAZY.
                    </p>
                    <p>
                      You have the PRETTIEST eyes i have ever seen. I remember them so perfectly. You had me hooked onto you and your pretty eyes the moment i saw you on 4th Oct, 2024, for the very first time after a year. Your eyes and your hair and your ADORABLE voice and that pretty blue lehenga/chanyacholi (i still get confused), are the things i was HOOKED onto. you had me going crazy with your beauty. 
                    </p>
                    <p>
                      I love and adore how comfortable we have gotten with each other, and it feels so much more than a year.
                      I love how you boss me around and i love the way you drag me while shopping, while doing everything, it is the MOST adorable thing everrrr.
                    </p>
                    <p>
                      Our mini cooking dates, our drives, us just spending a little bit of time together is always the highlight of my day. You have made my life colorful and you have given me something to always look forward to, your presence.

                    </p>
                    <p>
                      I love when you dance and although i dont know shit about it, i would love to be your dance partner and learn from you, bas youll have to keep some patience for my stiff ass. :))))
                    </p>
                    <p>
                      Your laugh is the most contagious thing ever and i ABSOLUTELY LOVE IT. it is the cutest thing ever.
                      I DIE to hold your hand and feel your presence every single day, and being away from you is sucha torture.
                      I love deep talks with you, you are so knowledgeable and perfect.
                      Your hugs and kisses feel more like home than my own home ever has. Cuddling with you feels so safe and secure its crazy. and yes i love being babied by you BUT I WANNA BABY YOU AS WELL SO PLEASE LET ME.
                    </p>
                    <p>
                      I HOPEEEEE one day you can realize how PRETTY you are in my eyes and how adorable you are. 
                    </p>
                    <p>
                      I HOPE i get to go on a trip with you this year, it is literally on TOP of my bucket list.
                      AND CAN WE PLEASE FINALLY GO TO A CONCERT TOGETHER I HAVE BEEN DYING SINCE DAY 1 IPSHITA ITS SO CRAZY WHEN ARE WE GOING???????
                    </p>
                    <p>
                      You are the most interesting person, please always stay by my side and keep educating me :).
                      You are determined and hardworking and i hope you and i stay happy forever. 
                      Love, Health and Wealth is all we need.
                    </p>
                    <p>
                      I cant wait to travel the whole world with you and explore, and go on adventures with you.
                    </p>
                    <p>
                      Thankyou for being understanding and handling my slow autistic ass.
                      You have made me the happiest person EVER.
                      You are the best girlfriend EVER and i am so so so so so so so grateful to call someone THIS pretty MY GIRLFRIEND.
                    </p>
                    <p>
                      You are the love of my life and I CANNNOTTTTTTTTT wait to spend the rest of my life with you. 
                      I CANNNNOTTTT wait to be with you every single moment for the rest of my life
                    </p>
                    <p>
                      Im sorry this letter is kinda not well structured cuz i didnt think it through and i do not want to edit it after im done writing, what i write is final.
                    </p>
                    <p>
                      I promise to be with you forever and spend every moment with you, little or big. I will love you forever and stay by your side and listen to you yap.
                    </p>

                    <h5 className="signature-letter">
                      Happy Birthday, Ipshi 💕<br />
                      I love you
                      <br />
                      Always and Forever  <FaInfinity />
                    </h5>
                  </>
                )}
              </div>
            </div>

            <div className="right-panel">
              <div className="birthday-animation">
                <div className="balloons">
                  <div className="balloon balloon-1">🎈</div>
                  <div className="balloon balloon-2">🎈</div>
                  <div className="balloon balloon-3">🎈</div>
                </div>
                <div className="confetti">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="confetti-piece"
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        color: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24", "#f0932b"][
                          Math.floor(Math.random() * 5)
                        ],
                      }}
                      
                    ><FaHeart /></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
  )
}

export default BirthdayCard
