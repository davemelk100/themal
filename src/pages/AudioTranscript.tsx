import { motion } from "framer-motion";
import { Suspense } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { useState, useRef } from "react";

// Import Roboto Serif font
import "@fontsource/roboto-serif/400.css";
import "@fontsource/roboto-serif/700.css";

interface AudioTrack {
  id: number;
  title: string;
  artist: string;
  url: string;
  duration: string;
  transcript: string;
}

const audioTracks: AudioTrack[] = [
  {
    id: 1,
    title: "Don't Sully My Name",
    artist: "Zaven",
    url: "/audio/Zaven - Don%27t Sully My Name 2.m4a",
    duration: "2:15",
    transcript: `"You've truly honored the Melkonian name. My father always said, "You can do anything you want, but never tarnish our name." And you haven't. There's a story about a famous person whose reputation was ruined unfairly. When he was finally proven innocent, he asked, "Okay, so where do I go to get my reputation back?" That's the honest truth. Once your name is damaged, it's tough to restore. You've never had to deal with that, and that's something to take pride in."`,
  },
  {
    id: 2,
    title: "Dr Jack, part 1",
    artist: "Zaven",
    url: "/audio/Zaven - Dr Jack.m4a",
    duration: "4:30",
    transcript: `"Jack moved in with your you guys right in Pontac for a while. Jack I knew Jack as a kid and not through school but my sister rendered a house right across the street from him. So I spent a lot of time with Jack. uh I've actually uh her brains were a different frequency. 

He went on to better himself and I just kind of hung back with the crowd. But he was an amazing he he really wasn't a amazing kid.. I know a lot of bad stuff that have been said about him, but uh uh his his determination to better one's life came from the fact that his mother was dying of cancer, and she was in total agony constantly, and he had made up his mind then if there's a way that I can relieve people from having this kind of disastrous end life, I'm going to do it. and that's why he got how that came about, it I'd never realized that. 

It was a it was to help people with their pain patched together a concoction about tracy in her final fusion. I remember if she was just in so much pain on a circle bed and they put that bed up like that and Tracy's just just in such pain. And they said, you gotta wait 30 minutes for a shot. 

"That doesn't happen in today's world. can see the pumps is keeping their fain level. You know, I mean, keeping the pain can you imagine what these people went through?ics that we have today, and morphine, et cetera, et cetera, but why do you want to get somebody hooked down morphine? 

when there are other ways to do it? And he he made up his mind really kind of as a kid that if he had anything, if he was able to exclude a lot of acut, excruciating pain from somebody's last days, he was gonna do it. and that was how old was his mom? How old was his mom when she passed how old was he when she had cancer? 

Jack was probably, uh, maybe early teens. Oh, that young teens. uh, but boy had left an impression he did. That's why he got a lot of bad press, right?  Oh yeah we're team Kavorky in here. If you didn't if you didn't know his history, you would mark him as a uh it's an ogre, you know, somebody who uh a parified death that and that wasn't him. That just was him grow up from a young kid?  I mean you guys were a young kid. watched him grow up? I said, you were young kids together. You watched him grow up, there a reason and he he lived with you guys for a while, didn't she?  His parents were gone or something, and he stayed with you guys for like six months? I remember I think Grandpa told me this. I don't remember that period.  Okay. Because when we got to uh actually even in junior high, uh I I had devoted myself to be coming a vocational student. I was a tink and he was using his brain.  He was doing we got to high school, I was in the aircraft mechanics course and he was in the in the college prep thing. So in in high school, we rarely saw one another. Why?  I was in a different building and he was in the main building. So, yeah, there was a point in time when our our pil our pa paths, uh became widened, but I never forgotten case in point, he was living in Royal Oak in an apartment above a store. There was a funeral home almost regularly across the street. uh We had a a mutual friend who had passed away.  I had gone to a visitation and I walk into the place and I'm getting ready to leave and I come out and I my back is to the entry door and I'm walking down this hallway and I hear somebody else and I turn it's Jack. He remembered me from from behind no less. So yeah he was he was he was he really was extraordinary and and I'm uh you never wanted to go into a discussion with people who didn't understand.  I was approached one time at church of all places, uh by someone who asked me about uh you know something like what do you think about this jacket about? I was not going to get into a muslinging thing. and I said, well, you know, he he's doing uh he's a physician. He's doing what he thinks is proper.  This guy got all over me, but he's killing people. Really? uh, you're not saying that it's he relieving them from a horrible death?  You're saying he's killing people. So I would never get into discussions. The less people knew of my relationship when Jack of Morgan was better for the both of us.  I's. It's unique. was."`,
  },
  {
    id: 3,
    title: "Dr Jack, part 2",
    artist: "Zaven",
    url: "/audio/Zaven - Dr Jack pt 2.m4a",
    duration: "4:30",
    transcript: `"One day, Jack came up to me, and I said something like, "Hey, Jack, would you sign my yearbook?" He flipped it open to an empty page, nothing on it, and asked, "Mind if I use this?" I said, "No, go ahead, Jack," never expecting what came next. He pulled out an ink pen—not a ballpoint, but a real ink pen with green ink.

I was probably chatting with someone else while Jack was over there, scribbling away. He finished, handed the yearbook back to me, and I didn't even look at it right away. I just hoped the ink was dry before he closed it. I think it was.

Later, when I saw it, I was amazed. In just a minute and a half, he'd filled the entire page with this incredible cartoon. Jack was truly an amazing guy, so talented. It's a shame he's often misunderstood, only showing up in comedians' punchlines or negative stories."`,
  },
  {
    id: 4,
    title: "Eardrum Puncture",
    artist: "Zaven",
    url: "/audio/Zaven - eardrum puncture.m4a",
    duration: "3:45",
    transcript: `"I'm seeing a doctor soon to get my ears cleaned out—something about a vacuum for the wax buildup. I've been faking my way through conversations pretty well today, haven't I? It's not about loudness or tone; I don't need anyone shouting at me. I know I've got a hearing problem, but it's a long story. The short version? One ear's pretty much gone because of a hole in it.

You remember me mentioning that, right? I manage okay with the other ear, so I'll leave it at that. Oh, and how old am I now? Ninety-seven. At my age, a hearing problem's something I'm entitled to, don't you think? If that's my only issue, I'll wear it proudly.

Speaking of stories, we were laughing about how I got this house. Virginia took charge of finding us a new place. Back then, we were living in this tiny apartment—so small you had to step outside to change your mind. It was time to move. We ended up in Marshall, in a house next to where I grew up. The guy downstairs rented out the upstairs, and that's where we settled. It was a good move, no question."`,
  },
  {
    id: 5,
    title: "Hearing Aids",
    artist: "Zaven",
    url: "/audio/Zaven - hearing aids etc.m4a",
    duration: "3:20",
    transcript: `"I guess they have the right to do that. They gave me one last chance to say goodbye to the old hearing aids or whatever. It's like a routine joke with them—dropped it right in my lap. Can you believe it? They even said I looked older with my new haircut.

By the way, if you hear me saying "huh?" a lot, it's because I don't have my hearing aids in. They're the cheap $1.98 ones, not the fancy kind. Last time we talked, I said I was happy with them, and I am. The others they tried to sell me before were ridiculous—$8,000! I got a refund on those. The $1.98 ones work just fine, believe it or not.

When I decided I didn't want the expensive ones, it was a hassle. They were the kind that rest behind your ear, and they drove me nuts. I told them, "No way, I'm done with these." When I returned them, it turned out the physician assistant who did my exam was the son of a lady who works with Todd. Small world, right? So, when they processed the refund, they wrote something like, "Patient is a good friend of the Evans family." No questions asked, just like that. Worked out great for me.

As for the cheap ones, they're sitting on the counter, charging right now. They're doing a heck of a job for what they cost. The only reason I'm not wearing them today is because I've got a wax buildup. I've got an appointment this Friday to get it checked out. Even with the hearing aids in, it's not helping much until that's cleared up."`,
  },
  {
    id: 6,
    title: "Small Apartment",
    artist: "Zaven",
    url: "/audio/Zaven - small apartment .m4a",
    duration: "5:15",
    transcript: `"I have some old photos of the place we lived in back then. The outside wasn't finished yet—it wasn't rough, but it was still a work in progress. When I look at those pictures now, I think, "Who would've thought?" That's a great story, man. I hadn't heard that one before, and it's one of those moments that just sticks with you.

Virginia and I were living in this tiny apartment—so small you had to step outside to change your mind. I mean, it was that small. You've probably heard me use that line before, and I'll probably use it again. It's a good one, but it's gonna get worn out now.

Before we built our house, we moved into Elizabeth Lake Estates, just up the street from where you were on Avery. We bought a place there, and the best part was being right in the neighborhood with friends. It was a sweet deal. We were happy, no kids yet, so everything was coming up roses. You could even stay inside to change your mind there.

We had access to that fabulous beach, too. Back then, it wasn't as crowded as it is now. I was working a job with day and night shifts, so on night shifts, we'd head to the lake, and it'd be deserted. Can you imagine that now? These days, the beach is a zoo—probably like a boxing match or some kind of madness. Back then, we had that big metal slide and a little swing set, and that was enough. The place was always well-kept, not like today with all the traffic and trash that comes with it. It just gets a bit yucky now.

I hate change, don't we all? But Virginia had this itch to move. It wasn't that we didn't like Elizabeth Lake Estates; she just wanted something new. And me? I've got that ring in my nose—she tugs the chain, and I'm out the door. She did a hell of a job picking our next spot, though. No regrets there. We moved, and as they say, the rest is history.

We moved into our current place in '61, the same year they finished building it. I was 11 years old, for crying out loud. I remember seeing you at Food Town back then. That place predates everything. I was a grocery maven, no question. My best friend ended up marrying Mrs. Adler, who worked there—she was one of the Adlers, you know, the family behind Food Town. Her husband was a butcher, and they had a great, happy marriage. Even after he passed, she stayed close with her son, a real wheeler-dealer in the Clarkston area. The Adlers and Roths were the ones who developed Clarkston. In fact, Roth is our landlord at the store."`,
  },
  {
    id: 7,
    title: "Musical History",
    artist: "Zaven",
    url: "/audio/Zaven - musical history and disinterest.m4a",
    duration: "4:00",
    transcript: `"I had the chance to take piano lessons when I was younger. The teacher would come to the house, take each of my fingers, and move them around—some kind of warm-up, I guess. But honestly, I was more interested in being outside playing ball. My brother was the musical one; he got really good at percussion. I love music, but I never learned to play it. That's about the extent of my musical talent.

When it came to singing, though, I found my place in a barbershop quartet. I sang bass. That's the only thing I ever accomplished musically, but we were pretty good. Jack Tuber was in the group too, and we had a blast. Those four-part harmonies were something special—close, tight, and beautiful. Nobody does that kind of harmony anymore, you know? It's a lost art."`,
  },
  {
    id: 8,
    title: "Builders",
    artist: "Zaven",
    url: "/audio/Zaven - builders.m4a",
    duration: "3:30",
    transcript: `"Who's started? kidding. Oh, yeah, and have you It's a small and he he owns just about everything out there.  You know he really does. It's a riot talking to him and uh of course his daughter is involved in the business theory, but yeah, Adler and Roth were a partners in developing. It's amazing all development that happened in Clarkston, yeah.  

I had a very good friend who has since passed, who lived where the control was for the damn.. Right there in downtown Clark? right and that's right across the street from there office. right.  He was bellyaging about that the last time I saw him is he had tried to figure out what to do to keep that thing under control. Well, and he didn't do a good job. still money. Oh, he had nice a nice thing to say about him because at the level would change automatically. and he said, you know, he doesn't do a good job with that damn with that damn damn.  

So, yeah, it was it's been an interesting uh interesting life, but he he was not happy with uh well, even though he's passed, believe me when I take, he'd still be unhappy about it. Bob Roth can't figure out what the hell he do to get that thing is they were they never changed. and folks. reason that damn that damn damnn is a problem. It really is they just they can't make hazard tails out of what to do because this thing under it is it is probably because of the way it was originally designed.  

And if you want to get into it now, the cost would be ast builder fee the licensing card to twel00 to get a building license or surprising he's connected but he could probably get around that but"`,
  },
];

const AudioTranscript = () => {
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<{ [key: number]: number }>({});
  const [duration, setDuration] = useState<{ [key: number]: number }>({});
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement | null }>({});

  const togglePlay = (trackId: number) => {
    const audio = audioRefs.current[trackId];
    if (!audio) return;

    if (playingTrack === trackId) {
      audio.pause();
      setPlayingTrack(null);
    } else {
      // Stop all other tracks
      Object.keys(audioRefs.current).forEach((id) => {
        const otherAudio = audioRefs.current[parseInt(id)];
        if (otherAudio && parseInt(id) !== trackId) {
          otherAudio.pause();
        }
      });

      audio.play();
      setPlayingTrack(trackId);
    }
  };

  const handleTimeUpdate = (trackId: number) => {
    const audio = audioRefs.current[trackId];
    if (audio) {
      setCurrentTime((prev) => ({ ...prev, [trackId]: audio.currentTime }));
    }
  };

  const handleLoadedMetadata = (trackId: number) => {
    const audio = audioRefs.current[trackId];
    if (audio) {
      setDuration((prev) => ({ ...prev, [trackId]: audio.duration }));
    }
  };

  const handleSeek = (trackId: number, value: number) => {
    const audio = audioRefs.current[trackId];
    if (audio) {
      audio.currentTime = value;
      setCurrentTime((prev) => ({ ...prev, [trackId]: value }));
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-white font-serif roboto-serif-page"
      style={{ fontFamily: "Roboto Serif, serif !important" }}
    >
      <Suspense
        fallback={
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        }
      >
        {/* Hero Section */}
        <section className="relative flex flex-col justify-center min-h-[120px] sm:min-h-[160px] pt-4 sm:pt-6 lg:pt-8">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            {/* Two-column layout: Left content + Right animation card */}
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
              {/* Left Column: Title, Navigation, Summary */}
              <div className="flex flex-col items-start flex-1">
                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.8, delay: 0.2 }}
                  className="mb-6 sm:mb-8"
                >
                  <h1
                    className="text-[clamp(1.5rem,4vw,3rem)] font-bold mb-1 title-font leading-none relative z-10 text-left"
                    style={{ letterSpacing: "-0.06em" }}
                  >
                    Audio and Transcript
                  </h1>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Audio Grid Section */}
        <section className="py-8 sm:py-12 lg:py-16">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.8, delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {audioTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.8, delay: 1.0 + index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  {/* Audio Player Section */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {track.title}
                      </h3>
                    </div>

                    {/* Audio Controls */}
                    <div className="flex items-center gap-4 mb-4">
                      <button
                        onClick={() => togglePlay(track.id)}
                        className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        {playingTrack === track.id ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5 ml-0.5" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>{formatTime(currentTime[track.id] || 0)}</span>
                          <span>{formatTime(duration[track.id] || 0)}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max={duration[track.id] || 0}
                          value={currentTime[track.id] || 0}
                          onChange={(e) =>
                            handleSeek(track.id, parseFloat(e.target.value))
                          }
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        defaultValue="0.7"
                        className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>

                  {/* Transcript Section */}
                  <div className="p-6">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Transcript
                    </h4>
                    <div className="h-48 overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {track.transcript}
                      </p>
                    </div>
                  </div>

                  {/* Hidden Audio Element */}
                  <audio
                    ref={(el) => (audioRefs.current[track.id] = el)}
                    src={track.url}
                    preload="metadata"
                    onTimeUpdate={() => handleTimeUpdate(track.id)}
                    onLoadedMetadata={() => handleLoadedMetadata(track.id)}
                    onEnded={() => setPlayingTrack(null)}
                    onError={(e) => {
                      console.error("Audio error for track:", track.title, e);
                      console.error("Audio URL:", track.url);
                    }}
                    onLoadStart={() =>
                      console.log("Loading audio:", track.title)
                    }
                    onCanPlay={() =>
                      console.log("Audio can play:", track.title)
                    }
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </Suspense>
    </div>
  );
};

export default AudioTranscript;
