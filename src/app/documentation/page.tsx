"use client";
import Scrollspy from "react-scrollspy";

import { Link as ScrollLink } from "react-scroll";
export default function Documentation() {
  return (
    <div className="flex mx-3 md:mx-4 lg:mx-40 gap-20">
      <div className="w-3/12  flex-col gap-5 hidden md:flex fixed">
        <div className="font-bold text-xl">Table of contents</div>
        <Scrollspy
          items={[
            "introduction",
            "what-we-do",
            "whats-our-goal",
            "do-we-support-payment",
          ]}
          currentClassName="active-link"
          offset={-100}
          className="flex flex-col gap-4 [&>*]:cursor-pointer"
        >
          <li>
            <ScrollLink
              to="introduction"
              smooth={true}
              spy={true}
              offset={-100}
            >
              Introduction
            </ScrollLink>
          </li>
          <li>
            <ScrollLink to="what-we-do" smooth={true} spy={true} offset={-100}>
              What we do
            </ScrollLink>
          </li>
          <li>
            <ScrollLink
              to="whats-our-goal"
              smooth={true}
              spy={true}
              offset={-100}
            >
              Whats our goal
            </ScrollLink>
          </li>
          <li>
            <ScrollLink
              to="do-we-support-payment"
              smooth={true}
              spy={true}
              offset={-100}
            >
              Do we support payment
            </ScrollLink>
          </li>
        </Scrollspy>
      </div>
      <div className="flex flex-col gap-10 md:w-9/12 md:ml-60">
        <div id="introduction">
          <h1 className="font-bold text-2xl mb-4">Introduction</h1>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsum, et
            fugiat. Excepturi, dolorem cupiditate eaque voluptatum quod
            temporibus saepe ipsam amet corrupti ut repellat optio ab ad,
            pariatur aperiam! Illo. Lorem, ipsum dolor sit amet consectetur
            adipisicing elit. Ipsum, et fugiat. Excepturi, dolorem cupiditate
            eaque voluptatum quod temporibus saepe ipsam amet corrupti ut
            repellat optio ab ad, pariatur aperiam! Illo. Lorem, ipsum dolor sit
            amet consectetur adipisicing elit. Ipsum, et fugiat. Excepturi,
            dolorem cupiditate eaque voluptatum quod temporibus saepe ipsam amet
            corrupti ut repellat optio ab ad, pariatur aperiam! Illo.
          </p>
        </div>
        <div id="what-we-do">
          <h1 className="font-bold text-2xl mb-4">What we do</h1>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam
            explicabo quam perferendis harum sequi repellendus exercitationem
            neque ipsam eveniet delectus nisi voluptate error incidunt
            temporibus aliquam, laboriosam nesciunt inventore veritatis. Lorem,
            ipsum dolor sit amet consectetur adipisicing elit. Ipsum, et fugiat.
            Excepturi, dolorem cupiditate eaque voluptatum quod temporibus saepe
            ipsam amet corrupti ut repellat optio ab ad, pariatur aperiam! Illo.
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsum, et
            fugiat. Excepturi, dolorem cupiditate eaque voluptatum quod
            temporibus saepe ipsam amet corrupti ut repellat optio ab ad,
            pariatur aperiam! Illo. Lorem, ipsum dolor sit amet consectetur
            adipisicing elit. Ipsum, et fugiat. Excepturi, dolorem cupiditate
            eaque voluptatum quod temporibus saepe ipsam amet corrupti ut
            repellat optio ab ad, pariatur aperiam! Illo.
          </p>
        </div>
        <div id="whats-our-goal">
          <h1 className="font-bold text-2xl mb-4">Whats our goal</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae
            dolor sapiente asperiores, fugit, soluta quis, dolorum facere quia
            cupiditate inventore enim tempora voluptatum ipsum a impedit
            adipisci dignissimos qui accusantium? Lorem, ipsum dolor sit amet
            consectetur adipisicing elit. Ipsum, et fugiat. Excepturi, dolorem
            cupiditate eaque voluptatum quod temporibus saepe ipsam amet
            corrupti ut repellat optio ab ad, pariatur aperiam! Illo. Lorem,
            ipsum dolor sit amet consectetur adipisicing elit. Ipsum, et fugiat.
            Excepturi, dolorem cupiditate eaque voluptatum quod temporibus saepe
            ipsam amet corrupti ut repellat optio ab ad, pariatur aperiam! Illo.
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsum, et
            fugiat. Excepturi, dolorem cupiditate eaque voluptatum quod
            temporibus saepe ipsam amet corrupti ut repellat optio ab ad,
            pariatur aperiam! Illo.
          </p>
        </div>
        <div id="do-we-support-payment">
          <h1 className="font-bold text-2xl mb-4">Do we support payment</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam
            accusantium quae provident culpa quis vel, autem facilis quidem
            esse! Distinctio qui fugiat nobis odit ea laudantium quam quis
            veritatis soluta. Lorem, ipsum dolor sit amet consectetur
            adipisicing elit. Ipsum, et fugiat. Excepturi, dolorem cupiditate
            eaque voluptatum quod temporibus saepe ipsam amet corrupti ut
            repellat optio ab ad, pariatur aperiam! Illo. Lorem, ipsum dolor sit
            amet consectetur adipisicing elit. Ipsum, et fugiat. Excepturi,
            dolorem cupiditate eaque voluptatum quod temporibus saepe ipsam amet
            corrupti ut repellat optio ab ad, pariatur aperiam! Illo. Lorem,
            ipsum dolor sit amet consectetur adipisicing elit. Ipsum, et fugiat.
            Excepturi, dolorem cupiditate eaque voluptatum quod temporibus saepe
            ipsam amet corrupti ut repellat optio ab ad, pariatur aperiam! Illo.
          </p>
        </div>
      </div>
    </div>
  );
}
