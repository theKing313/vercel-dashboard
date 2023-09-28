'use client'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import './dashboard.scss'
import { useEffect, useState } from 'react'
import { getAllItems, setNewItem, deleteItem, changeItem } from '@/redux/features/dashBoardSlice'
import Image from 'next/image'


type TEntry = {
    rowName: string,
    id: string,
    salary: string,
    machineOperatorSalary: string,
    estimatedProfit: string,
    child?: [],
}


export default function Dashboard() {
    const menuActive = useAppSelector((state) => state.dashBoardSlice.openMenu)
    const status = useAppSelector((state) => state.dashBoardSlice.status)
    const items = useAppSelector((state) => state.dashBoardSlice.items)

    const [activeForm, setActiveForm] = useState(false)

    // const [activeForm, setActiveForm] = useState(false)

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllItems())
    }, [])




    console.log(items)
    const [parentId, setParentId] = useState<any>(null)


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // setSearchTerm(e.target.value);
        // setSearchRowName(e.target.value);
    };
    // const deleteItem = (id: number) => {
    //     // setSearchTerm(e.target.value);
    //     // setSearchRowName(e.target.value);

    // };

    // const changeItem = () => {
    //     console.log('changeItem')
    // }

    const createNewItem = (id: number) => {
        setActiveForm(!activeForm)
        setParentId(id)
    }


    // testing dalete later
    const [childParent, setChildParent] = useState(false)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement> | any) => {
        e.preventDefault();
        const newItem = {
            equipmentCosts: 0,
            estimatedProfit: searchEstimatedProfit,
            machineOperatorSalary: 0,
            mainCosts: 0,
            materials: searchMaterials,
            mimExploitation: 0,
            overheads: searchOverheads,
            parentId: parentId,
            rowName: searchRowName,
            salary: searchsalary,
            supportCosts: 0
        }
        console.log(newItem)
        dispatch(setNewItem(newItem))

    }
    const [searchsalary, setSearchSalary] = useState<string>('0')
    const [searchRowName, setSearchRowName] = useState<string>('')
    const [searchMaterials, setSearchMaterials] = useState<string>('0')
    const [searchOverheads, setSearchOverheads] = useState<string>('0')
    const [searchEstimatedProfit, setSearchEstimatedProfit] = useState<string>('0')



    const ListItem = ({ item, depth }: any) => {
        console.log(depth)
        const [isCurrentBeingUpdated, setisCurrentBeingUpdated] = useState(false)
        const renderTitleOrInput = () => {
            const [searchsalary, setSearchSalary] = useState<string>('0')
            const [searchRowName, setSearchRowName] = useState<string>('')
            const [searchMaterials, setSearchMaterials] = useState<string>('0')
            const [searchOverheads, setSearchOverheads] = useState<string>('0')
            const [searchEstimatedProfit, setSearchEstimatedProfit] = useState<string>('0')
            console.log(depth)
            const changeHandleSubmit = (e: React.FormEvent<HTMLFormElement> | any) => {
                e.preventDefault();
                const newItem = {
                    "equipmentCosts": 0,
                    "estimatedProfit": searchEstimatedProfit,
                    "machineOperatorSalary": 0,
                    "mainCosts": 0,
                    "materials": 0,
                    "mimExploitation": 0,
                    "overheads": 0,
                    "rowName": searchRowName,
                    "salary": 0,
                    "supportCosts": 0
                    // equipmentCosts: 0,
                    // estimatedProfit: searchEstimatedProfit,
                    // machineOperatorSalary: 0,
                    // mainCosts: 0,
                    // materials: searchMaterials,
                    // mimExploitation: 0,
                    // overheads: searchOverheads,
                    // // parentId: parentId,
                    // rowName: 'searchRowName',
                    // salary: searchsalary,
                    // supportCosts: 0
                }

                console.log(item.id)
                dispatch(changeItem({ item: newItem, id: item.id }))

            }
            return isCurrentBeingUpdated ? (
                <form className='search-form w-full col-span-8' onSubmit={changeHandleSubmit}>
                    {/* flex  justify-between */}
                    <div className='search-form-elem  grid grid-cols-8 gap-4 h-[2.5rem]'>

                        <Image
                            className='flex justify-center '
                            // loader={() => '/preloader.png'}
                            src={'/artilce.svg'}
                            alt="cover"
                            width={22}
                            height={22}
                            sizes="100vw"
                            objectFit='cover'
                            unoptimized

                        ></Image>

                        <input type="text" className='form-control col-span-3' placeholder={item.rowName}
                            // value={searchsalary}
                            onChange={(e) => setSearchRowName(e.target.value)}
                        />

                        <input type="text" className='form-control ' placeholder='0' onChange={(e) => { setSearchSalary(e.target.value) }} />
                        <input type="text" className='form-control ' placeholder='0' onChange={(e) => { setSearchMaterials(e.target.value) }} />
                        <input type="text" className='form-control ' placeholder='0' onChange={(e) => { setSearchOverheads(e.target.value) }} />
                        <input type="text" className='form-control ' placeholder='0' onChange={(e) => { setSearchEstimatedProfit(e.target.value) }} />

                        <button className='hidden'></button>
                    </div>

                </form>
            ) : (
                <>

                    <div className="relative">
                        <button className="flex gap-x-3 relative button-hover items-center">
                            <Image
                                className=' '
                                // loader={() => '/preloader.png'}

                                // changeItem(item.id)

                                onClick={() => { createNewItem(item.id) }}
                                src={'/artilce.svg'}
                                alt="cover"
                                width={22}
                                height={22}
                                sizes="100vw"
                                objectFit='cover'
                                unoptimized
                            ></Image>


                            <Image
                                onClick={() => { dispatch(deleteItem(item.id)) }}
                                className=' '
                                // loader={() => '/preloader.png'}
                                src={'/trash.svg'}
                                alt="cover"
                                width={20}
                                height={20}
                                sizes="100vw"
                                objectFit='cover'
                                unoptimized
                            ></Image>
                        </button>
                        {item.child.length > 0 &&

                            item.child.map((item: any, index: number) => {
                                return (
                                    <>
                                        {/* <div className={`absolute left-[${index * 4}rem]`}  >fred</div>  left-[${index * 4}rem] top-[${index * 4}px]*/}
                                        <Image
                                            className={`flex justify-center absolute z-[8]`}
                                            // left: `${8 * index}px`,
                                            //
                                            style={{ left: `${10}px`, top: `${82 * index}px` }}
                                            // loader={() => '/preloader.png'}
                                            src={'/line.svg'}
                                            alt="cover"
                                            width={21.5}
                                            height={21.5}
                                            sizes="100vw"
                                            objectFit='cover'
                                            unoptimized
                                        ></Image>
                                    </>

                                )
                            })
                        }
                    </div>
                    <button className='item__label col-span-3 text-left' onDoubleClick={() => { setisCurrentBeingUpdated(!isCurrentBeingUpdated); }}>{item.rowName} </button>
                    <div className='item__label ' >{item.salary} </div>
                    <div className='item__label'>{item.machineOperatorSalary} </div>
                    <div className='item__label'>{item.estimatedProfit} </div>
                </>
            );
        };
        return (
            // ${childParent && 'pl-6'  }
            <div className={`pl-[.9375rem]  grid grid-cols-8 gap-4 h-[3.75rem]  items-center `}>
                {renderTitleOrInput()}
            </div >

        )
    }

    // testing dalete later
    function Entry({ entry, depth }: { entry: any, depth: number }) {
        const [active, setActive] = useState(false)

        function ClickN(depth: any) {
            setActive(!active)
        }
        console.log(entry)
        return (
            <>
                {/*border-[1px] border-y-[#414144] border-x-0 */}
                <div className="w-full border-item">
                    {<div style={{ paddingLeft: `${25}px` }}>
                        <ListItem
                            item={entry}
                            childParent={true}
                            depth={depth + 1}
                        >
                        </ListItem>
                        {entry.child?.map((entry: any, index: number) => <Entry key={index} entry={entry} depth={depth + 1}></Entry>)}
                    </div >}
                </div>
            </>
        )
    }
    return (
        <section className='w-full'>
            {/* <DataTable data={tasks} columns={columns} /> */}
            {/* {items && JSON.stringify(items)} */}
            <div className={`pl-[.9375rem] grid grid-cols-8 gap-4 h-[2.5rem]  items-center border-[1px] border-[#414144]`}>
                <div className='text-[#A1A1AA] text-sm '>Уровень</div>
                <div className='text-[#A1A1AA] text-sm col-span-3'>Наименование работ</div>
                <div className='text-[#A1A1AA] text-sm'>Основная з/п</div>
                <div className='text-[#A1A1AA] text-sm'>Оборудование</div>
                <div className='text-[#A1A1AA] text-sm'>Накладные расходы</div>
                <div className='text-[#A1A1AA] text-sm'>Сметная прибыль</div>
            </div>
            {menuActive &&
                <>
                    {items && items.map((item: any) => {
                        return (
                            <>

                                <ListItem
                                    item={item}
                                ></ListItem>
                                {item?.child.map((item: any, index: number) => { return (<Entry key={index} entry={item} depth={0}></Entry>) })}
                            </>
                        )

                    })}
                    {/*  && activeForm && */}
                    {items.length === 0 || activeForm ?
                        <>

                            <form className='search-form w-full pl-[.9375rem]' onSubmit={handleSubmit}>

                                <div className='search-form-elem'>
                                    <div className={`${childParent && 'pl-6'} grid grid-cols-8 gap-4 h-[3.75rem]  items-center`}>
                                        <Image
                                            className='flex justify-center '
                                            // loader={() => '/preloader.png'}
                                            src={'/artilce.svg'}
                                            alt="cover"
                                            width={22}
                                            height={22}
                                            sizes="100vw"
                                            objectFit='cover'
                                            unoptimized

                                        ></Image>

                                        <input type="text" className='form-control ' placeholder='New item' onChange={(e) => { setSearchRowName(e.target.value) }} />
                                        <input type="text" className='form-control col-span-3' placeholder='0' onChange={(e) => { setSearchSalary(e.target.value) }} />
                                        <input type="text" className='form-control ' placeholder='0' onChange={(e) => { setSearchMaterials(e.target.value) }} />
                                        <input type="text" className='form-control ' placeholder='0' onChange={(e) => { setSearchOverheads(e.target.value) }} />
                                        <input type="text" className='form-control ' placeholder='0' onChange={(e) => { setSearchEstimatedProfit(e.target.value) }} />
                                        <button className='hidden'></button>
                                    </div >

                                </div>

                            </form>


                        </>
                        : ''}
                </>

            }
        </section >
    )
}
