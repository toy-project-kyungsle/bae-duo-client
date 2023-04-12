import React, { Fragment, useEffect, useState } from 'react'
import Image from 'next/image'
import moment from 'moment'
import * as Styled from './Home.styles'
import { FaClock } from 'react-icons/fa'
import { TbNotesOff } from 'react-icons/tb'
import { RiUser3Fill, RiAddLine } from 'react-icons/ri'
import { categoryName, getKORMoneyString, getPercentage, tagByStatus } from './data'
import tempProfileImg from '@/public/images/profile_small.svg'
import starterImg from '@/public/images/starter.svg'
import Button from '../../commons/button/Button'
import Tag from '../../commons/tag/Tag'
import { useQuery, useQueryClient } from 'react-query'
import { getAllFundingList } from '@/src/commons/api/mainApi'
import { getAllFundingListProps } from '@/src/commons/types/mainApi'
import { color } from '@/src/commons/styles/color'

const Home = () => {
  const queryClient = useQueryClient() //delete할때 필요.
  const [category, setCategory] = useState(0)
  const [filterByDate, setFilterByDate] = useState<getAllFundingListProps[]>([])
  const { isLoading, data } = useQuery(['getAllFundingList'], () => getAllFundingList(), {
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    //staleTime: 3000,
    onSuccess: data => {
      const sortByReverse = data.sort((a, b) => moment(b.createdAt).diff(a.createdAt))
      setFilterByDate(sortByReverse)
    },
    onError: error => {
      console.dir(error)
    },
  })
  console.log(filterByDate)

  return (
    <div>
      <Styled.LandingHeader>
        <Styled.CategoryBox category={category}>
          {categoryName.map((item, idx) => (
            <button key={idx} onClick={() => setCategory(idx)}>
              {item}
            </button>
          ))}
        </Styled.CategoryBox>
        <Button size="small" variant="outlined">
          펀딩 추가 <RiAddLine />
        </Button>
      </Styled.LandingHeader>
      <Styled.BrandsBox>
        {filterByDate?.map(
          item =>
            (category === 0 || item.status === category) && (
              <Fragment key={item.createdAt}>
                <Styled.BrandsCard>
                  <Styled.FundingInfo>
                    <Styled.StatusBox>
                      <Styled.FundingDate>{moment(item.createdAt).format('YYYY.MM.DD')}</Styled.FundingDate>
                      <Tag
                        text={`펀딩 ${categoryName[item.status] ?? '실패'}`}
                        color={tagByStatus(item.status)?.color}
                        background={tagByStatus(item.status)?.background}
                      />
                    </Styled.StatusBox>
                    <section>
                      <Styled.BrandName>{item.brand}</Styled.BrandName>
                      <Styled.Starter>
                        <Image src={tempProfileImg} alt="none" width={16} height={16} />
                        <span>{item.starter}</span>
                        <Image src={starterImg} alt="none" />
                      </Styled.Starter>
                    </section>
                  </Styled.FundingInfo>
                  <Styled.LimitBox>
                    <div>
                      <RiUser3Fill />
                      <div>
                        <b>
                          {item.curMember}/{item.minMember}
                        </b>
                        <span> 명 참여</span>
                      </div>
                    </div>
                    <div>
                      <FaClock />
                      <div>
                        <b>{moment(item.deadline).format('hh:mm')}</b>
                        <span> 마감</span>
                      </div>
                    </div>
                  </Styled.LimitBox>
                  <Styled.ProgressBox>
                    <Styled.Percentage percentage={getPercentage(item.curPrice, item.curPrice * item.curMember)}>
                      {item.curMember ? (
                        <span>{`${getPercentage(item.curPrice, item.minPrice)}% 달성했어요`}</span>
                      ) : (
                        <span>참여인원이 없습니다.</span>
                      )}
                      <span>{`${getKORMoneyString(item.curPrice)}원 / ${getKORMoneyString(item.minPrice)}원`}</span>
                    </Styled.Percentage>
                    <Styled.ProgressBar percentage={getPercentage(item.curPrice, item.minPrice)}>
                      <div></div>
                    </Styled.ProgressBar>
                  </Styled.ProgressBox>
                </Styled.BrandsCard>
              </Fragment>
            )
        )}
      </Styled.BrandsBox>
      {filterByDate.length === 0 && (
        <Styled.EmptySection>
          <TbNotesOff style={{ width: '24px', height: '24px' }} />
          empty data
        </Styled.EmptySection>
      )}
    </div>
  )
}

export default Home
