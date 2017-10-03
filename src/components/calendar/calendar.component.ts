import { Component, Input, Output, EventEmitter, HostListener, ElementRef }
  from '@angular/core';
import { Events, NavController, AlertController, Platform, ItemSliding } from 'ionic-angular';
import * as moment from 'moment';
//import {DragulaModule , DragulaService} from "../../../node_modules/ng2-dragula/ng2-dragula"
import { DragulaModule, DragulaService } from "ng2-dragula/ng2-dragula"
import * as shortid from 'shortid';
import { Http, Headers, RequestOptions } from "@angular/http";
import { AlarmdetailsPage } from '../../pages/alarmdetails/alarmdetails';
import { CalendardetailPage } from '../../pages/calendardetail/calendardetail';

import { AddcalendarPage } from '../../pages/addcalendar/addcalendar';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';
interface CalendarEvent {
  data?: any;
  id?: string;
  name: string;
  type?: string;
  startDate: Date;
  endDate: Date;
  allDay?: boolean;
  isExtension?: boolean;
  extensionMonthViewDayIdxs?: number[];
  icon?: string;
  ontap?: Function;
  onpress?: Function;
  ondoubletap?: Function;
}

interface CalendarDay {
  date: moment.Moment;
  events: CalendarEvent[];
}

interface MonthView {
  days: CalendarDay[];
  numberOfDaysThisMonth: number;
  firstDayOfMonth: moment.Moment;
  lastDayOfMonth: moment.Moment;
  selectedDate: moment.Moment;
}

interface WeekView {
  days: any[];
  firstDayOfWeek: moment.Moment;
  lastDayOfWeek: moment.Moment;
  selectedDate: moment.Moment;
}

interface CalendarControl {
  viewMode: string;
  dateSelection: moment.Moment;
  selectedYear: number;
  selectedMonth: string;
  selectedDay: number;
  monthView: MonthView;
  weekView: WeekView;
}

/*@Component({
  templateUrl: 'build/components/calendar/calendar.component.html',
  selector: 'ionic2-calendar',
  //styleUrls: ['build/components/calendar.component.css'], wait for: https://github.com/driftyco/ionic-cli/issues/1196
  directives: [Dragula],
  viewProviders: [DragulaService]
})*/

@Component({
  selector: 'ionic2-calendar',
  templateUrl: 'calendar.component.html',
  providers: [DragulaService, Config]
})





export class CalendarComponent {
  allselected: any;
  typeStr: any;
  serviceselected: any;
  alarmselected: any;
  eventsselected: any;
  dateHeaderTitle: any;
  petselection: any;
  pet: string = "ALL";
  onLoad: boolean;
  public currentCalendarDate: any;
  public currentDate: any;
  public currentMonth: any;
  public currentYear: any;
  public monthstr: any;
  calendarResultAll: any;
  daySession: any;
  currentDateFormatToday: any;
  calendarResultService: any;
  calendarResultEvent: any;
  calendarResultAlarm: any;
  currentDataHighlights: any;
  public totalCountEventDateWise: any;
  noeventtitle: any;
  highlightdots: any;
  public EVENTVIEWACCESS: any;
  public EVENTCREATEACCESS: any;
  public EVENTEDITACCESS: any;
  public EVENTDELETEACCESS: any;
  public ALARMVIEWACCESS: any;
  public ALARMDELETEACCESS: any;
  public SERVICEVIEWACCESS: any;
  public SERVICECREATEACCESS: any;
  public month: any;
  public date: any;
  public SERVICEEDITACCESS: any;
  public SERVICEDELETEACCESS: any;
  public eventIdentify = [];
  public serviceIdentify = [];
  public alarmIdentity = [];
  public highlighteddata = [];
  public userId: any;
  public monthTitle: any;
  public yearTitle: any;
  public companyId: any;
  public calendarMonth: any;
  public calendarDate: any;
  public calendarYear: any;
  months: string[] = moment.months();
  weekDays: any[] = moment.weekdays();
  ctrl: CalendarControl;
  activeDragGroup: string;
  itemCameFromBag: any;
  draggingItem: any = null;
  draggingItemId: string;
  sizeClassChanged: boolean;
  sizeClass: string;
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;

  @Input('calEvents') calEvents: any[];
  @Output() afterEventMove = new EventEmitter<any>();
  @Output() onEventTap = new EventEmitter<any>();
  @Output() onEventDoubleTap = new EventEmitter<any>();
  @Output() onEventPress = new EventEmitter<any>();

  constructor(private conf: Config, public platform: Platform, private network: Network, private dragulaService: DragulaService, public navCtrl: NavController,
    private calendarElement: ElementRef,
    public events: Events, private http: Http, public alertCtrl: AlertController) {
    let currentDate = new Date();
    this.currentDataHighlights = '';
    this.currentDate = currentDate.getDate();
    this.currentMonth = currentDate.getMonth() + 1;
    if (this.getlength(this.currentMonth) == 1) {
      this.currentMonth = '0' + this.currentMonth;
    } else {
      this.currentMonth = this.currentMonth;
    }
    this.currentYear = currentDate.getFullYear();
    this.userId = localStorage.getItem("userInfoId");
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.EVENTVIEWACCESS = localStorage.getItem("CALENDAR_EVENTS_VIEW");
    this.EVENTCREATEACCESS = localStorage.getItem("CALENDAR_EVENTS_CREATE");
    this.EVENTEDITACCESS = localStorage.getItem("CALENDAR_EVENTS_EDIT");
    this.EVENTDELETEACCESS = localStorage.getItem("CALENDAR_EVENTS_DELETE");
    this.ALARMVIEWACCESS = localStorage.getItem("UNITS_ALARM_VIEW");
    this.ALARMDELETEACCESS = localStorage.getItem("UNITS_ALARM_DELETE");

    this.SERVICEVIEWACCESS = localStorage.getItem("UNITS_SERVICINGINFO_VIEW");
    this.SERVICECREATEACCESS = localStorage.getItem("UNITS_SERVICINGINFO_CREATE");
    this.SERVICEEDITACCESS = localStorage.getItem("UNITS_SERVICINGINFO_EDIT");
    this.SERVICEDELETEACCESS = localStorage.getItem("UNITS_SERVICINGINFO_DELETE");
    dragulaService.drag.subscribe((value) => {
      console.log(`drag: ${value[0]}`);
      this.onDrag(value.slice(1));
    });
    dragulaService.drop.subscribe((value) => {
      console.log(`drop: ${value[0]}`);
      this.onDrop(value.slice(1));
    });
    this.networkType = '';
    this.permissionMessage = conf.rolePermissionMsg();
    this.apiServiceURL = conf.apiBaseURL();
    this.platform.ready().then(() => {
      this.network.onConnect().subscribe(data => {
        console.log("maps.ts Platform ready-onConnent:" + data.type);
        localStorage.setItem("isNet", 'online');
        this.networkType = '';
      }, error => console.error(error));
      this.network.onDisconnect().subscribe(data => {
        console.log("maps.ts Platform ready-onDisconnect:" + data.type);
        localStorage.setItem("isNet", 'offline');
        this.networkType = this.conf.networkErrMsg();
      }, error => console.error(error));

      let isNet = localStorage.getItem("isNet");
      if (isNet == 'offline') {
        this.networkType = this.conf.networkErrMsg();
      } else {
        this.networkType = '';
      }
    });
  }

  // In Dragula documentation it says dropModel for Angular2 also gives the
  // model on the controller, not just the HTML elements, but I see no
  // difference to onDrop function arguments. TRY AGAIN LATER!!
  //  private onDropModel(args) {
  //    let [bagName, el, target] = args;
  //    console.log('OnDropModel', bagName, el, target);
  //  }
  getlength(number) {
    return number.toString().length;
  }
  private onDrag(args) {
    let [e, el] = args;
    console.log('dragging', e, el);
    this.itemCameFromBag = el;
    this.draggingItem = e;
    this.draggingItemId = e.id;
    if (e.className.indexOf('is-continued') > 0 || e.className.indexOf('does-continue') > 0) {
      var found = false, idx = 0, currentClassName;
      while (!found && idx < e.classList.length) {
        currentClassName = e.classList[idx++];
        if (currentClassName.startsWith('multi-span-')) {
          this.activeDragGroup = currentClassName;
          //document.getElementsByClassName(currentClassName);
        }
      }
    }
  }

  ionViewWillEnter() {
    console.log("Ionview will enter function calling....");
    this.calEvents = [];
  }
  private onDrop(args) {
    let [e, el] = args;
    var droppedOnGridItem = el.parentElement.parentElement;
    var droppedOnGridItemIdx = droppedOnGridItem.dataset.idx;
    this.activeDragGroup = '';
    // Move events date and Output event
    // FOR isExtension events, move date moved by on all dates and move in grids!
    var movedElement, daysMoved, isExtensionOffsetToStartDate = 0;
    this.ctrl.monthView.days[droppedOnGridItemIdx].events.some((d: any) => {
      if (d.id === this.draggingItemId) {
        movedElement = d;
        if (movedElement.isExtension) {
          var cameFromGridIdx = this.itemCameFromBag.parentElement.parentElement.dataset.idx;
          console.log('moved element date', movedElement.startDate,
            'grid item it came from date', this.ctrl.monthView.days[cameFromGridIdx].date,
            '\n\ndays difference', this.ctrl.monthView.days[cameFromGridIdx].date.diff(moment(movedElement.startDate).startOf('day'), 'days'));
          isExtensionOffsetToStartDate = this.ctrl.monthView.days[cameFromGridIdx].date.diff(moment(movedElement.startDate).startOf('day'), 'days');
        }
        daysMoved = this.ctrl.monthView.days[droppedOnGridItemIdx].date.diff(moment(d.startDate).startOf('day'), 'days');
        d.startDate = this.moveDateByDays(d.startDate, daysMoved - isExtensionOffsetToStartDate);
        d.endDate = this.moveDateByDays(d.endDate, daysMoved - isExtensionOffsetToStartDate);
        // Now we need to move it into the correct order of events:
        var movedElementCalEventsIdx = this.calEvents.indexOf(movedElement);
        // Splice it:
        this.calEvents.splice(movedElementCalEventsIdx, 1);
        // Reinsert it at the correct position:
        this.insertDate(movedElement);
        console.log('Changed d.startDate to', d.startDate, 'and end date', d.endDate, '{IDX}', movedElementCalEventsIdx);
        return true;
      } else {
        return false;
      }
    });
    if (movedElement.isExtension) {
      // Remove all multi-span copies of moved item:
      movedElement.extensionMonthViewDayIdxs.forEach((d: number) => {
        var indexOfExtendedItem = this.ctrl.monthView.days[d].events.indexOf(movedElement);
        console.log('index of moved element', indexOfExtendedItem);
        if (indexOfExtendedItem >= 0) {
          this.ctrl.monthView.days[d].events.splice(indexOfExtendedItem, 1);
        }
      });
      // Now find first, create event there and extend: (SHOULD CHECK IF THERE IS OVERFLOW OR UNDERFLOW AFTER ADDING DAYS MOVED!!)
      console.log('daysMoves', daysMoved, movedElement.extensionMonthViewDayIdxs[0]);
      movedElement.isExtension = false;
      var firstDayMovesTo = movedElement.extensionMonthViewDayIdxs[0] + (daysMoved - isExtensionOffsetToStartDate);

      console.log('isExtensionOffsetToStartDate', isExtensionOffsetToStartDate);
      // Only add the event if it is not the first one. If it is the fisrt,
      // dragula will already add it, but after our code has finished, so we
      // would have our element twice:
      if (isExtensionOffsetToStartDate > 0) {
        this.ctrl.monthView.days[Math.max(0, firstDayMovesTo)].events.push(movedElement);
      }
      // Make new multi-span copies for moved event:
      this.makeExtensionEvents(this.ctrl.monthView.days[Math.max(0, firstDayMovesTo)], firstDayMovesTo);
    }
    // Emit event:
    this.emitEventMoved({
      element: movedElement,
      // Need to change this to firstItemDate if multi-span is moved
      movedToDate: this.ctrl.monthView.days[droppedOnGridItemIdx].date.toDate()
    })
    this.draggingItem = null;
  }

  /**
   * Fires when a calendar event was moved on the calendar.
   * The object this event fires contains the calendar event that moved (with
   * the start and end date already adjusted and the a date object for the day
   * the calendar event has moved to.
   */
  private emitEventMoved(ev) {
    this.afterEventMove.emit(ev);
  }

  private moveDateByDays(date, days) {
    var m = moment(date);
    m.add(days, 'days');
    return m.toDate();
  }

  ngOnInit() {
    this.onLoad = false;

    // this.defaultDevent('2017-08-22');
    this.addMissingIds();
    this.ctrl = {
      viewMode: 'month',
      dateSelection: moment(),
      selectedYear: moment().year(),
      selectedMonth: this.months[moment().month()],
      selectedDay: moment().date(),
      monthView: {
        days: [],
        numberOfDaysThisMonth: 0,
        firstDayOfMonth: null,
        lastDayOfMonth: null,
        selectedDate: null
      },
      weekView: {
        days: [],
        firstDayOfWeek: null,
        lastDayOfWeek: null,
        selectedDate: null
      }
    };
    console.log(" ngOnint A:" + this.ctrl);
    console.log(" ngOnint B" + JSON.stringify(this.ctrl));


    console.log(" ngOnit A" + JSON.stringify(this.ctrl));
    console.log(" ngOnit B" + this.ctrl.dateSelection);
    console.log(" ngOnit C" + this.ctrl.dateSelection.toString());
    let toStrDte = this.ctrl.dateSelection.toString();
    console.log(" ngOnit D" + toStrDte.split("T"));
    console.log(" ngOnit E" + toStrDte.split(" ")[3]);
    let calendardaystr = toStrDte.split(" ")[0];
    let calendarmonthstr = toStrDte.split(" ")[1];
    let calendardatestr = toStrDte.split(" ")[2];
    let calendaryearstr = toStrDte.split(" ")[3];
    console.log(" ngOnit G Day" + calendardaystr);
    console.log(" ngOnit H Month" + calendarmonthstr);
    console.log(" ngOnit I Date" + calendardatestr);
    console.log(" ngOnit J Year" + calendaryearstr);

    this.currentDateFormatToday = calendardaystr + " " + calendardatestr + " " + calendarmonthstr + " " + calendaryearstr;
    this.calendarDate = calendardatestr;
    this.calendarYear = calendaryearstr;
    this.calendarMonth = calendarmonthstr;
    let mn = moment().month() + 1;


    if (this.getlength(mn) == 1) {
      this.month = '0' + mn;
    } else {
      this.month = mn;
    }


    if (this.getlength(this.ctrl.selectedDay) == 1) {
      this.date = '0' + this.ctrl.selectedDay
    } else {
      this.date = this.ctrl.selectedDay;
    }

    let currentDate = this.ctrl.selectedYear + "-" + this.month + "-" + this.date;
    //let selDate = currentDate;
    localStorage.setItem("eventDate", currentDate);
    this.monthTitle = this.ctrl.selectedMonth;
    this.yearTitle = this.ctrl.selectedYear;
    this.monthstr = this.monthTitle + "-" + this.calendarYear;
    this.defaultDevent(currentDate, this.monthstr);
    this.makeDaysInMonthViewList();

    //this.onTimeSelected(this.ctrl.selectedYear, this.month, this.date, '');
  }

  ngAfterViewInit() {
    // This returns 0 clientWidth for some reason at first??? That's why wrapped
    // in timeout, UPDATE: only seems a problem when in phone emulation mode in chrome!!
    //    setTimeout(() => {
    this.updateSize();
    //    }, 1500);
  }

  addMissingIds() {
    this.calEvents.forEach((d: any) => {
      if (!d.id) {
        d.id = shortid.generate();
      }
    });
  }

  selectDate(date) {
    console.log("Select date function" + date);
    console.log("Select date function" + JSON.stringify(date));
    this.events.publish('calendar-event:month-grid-cell-tap', date);
    this.ctrl.dateSelection = date.date;
    this.ctrl.monthView.selectedDate = date;
  }

  monthNum2monthStr(monthNum) {
    return this.months[monthNum];
  };

  monthStr2monthNum(monthStr: string) {
    return this.months.indexOf(monthStr);
    //return this.months.indexOf([monthStr]);
  }

  updateMainView = function () {
    if (this.ctrl.viewMode === 'month') {
      this.makeDaysInMonthViewList();
    } else if (this.ctrl.viewMode === 'week') {
      this.makeDaysInWeekViewList();
    }
  }

  plusMonth = function (amount: number) {
    this.onLoad = false;
    this.ctrl.dateSelection.add(amount, 'month');
    this.ctrl.selectedMonth = this.monthNum2monthStr(this.ctrl.dateSelection.month());
    console.log(" plusMonth A" + JSON.stringify(this.ctrl));
    console.log(" plusMonth B" + this.ctrl.dateSelection);
    console.log(" plusMonth C" + this.ctrl.dateSelection.toString());
    let toStrDte = this.ctrl.dateSelection.toString();
    console.log(" plusMonth D" + toStrDte.split("T"));
    console.log(" plusMonth E" + toStrDte.split(" ")[3]);
    let calendardaystr = toStrDte.split(" ")[0];
    let calendarmonthstr = toStrDte.split(" ")[1];
    let calendardatestr = toStrDte.split(" ")[2];
    let calendaryearstr = toStrDte.split(" ")[3];
    console.log(" plusMonth G Day" + calendardaystr);
    console.log(" plusMonth H Month" + calendarmonthstr);
    console.log(" plusMonth I Date" + calendardatestr);
    console.log(" plusMonth J Year" + calendaryearstr);
    this.currentDateFormatToday = calendardaystr + " " + calendardatestr + " " + calendarmonthstr + " " + calendaryearstr;
    this.calendarDate = calendardatestr;
    this.calendarYear = calendaryearstr;
    this.calendarMonth = calendarmonthstr;


    //console.log(" plusMonth C" + this.ctrl.dateSelection.split("T"));
    //console.log(" plusMonth D" + this.ctrl.dateSelection.split("-")[0]);


    let mn = moment().month() + 1;
    let currentDate = this.ctrl.selectedYear + "-" + mn + "-" + this.ctrl.selectedDay;

    this.monthTitle = this.ctrl.selectedMonth;
    this.yearTitle = this.ctrl.selectedYear;
    this.monthstr = this.monthTitle + "-" + this.calendarYear;

    this.defaultDevent(currentDate, this.monthstr);
    this.updateMainView();


  }


  setDateSelectionMonth($event) {
    console.log('Calling setDateSelectionMonth');
    console.log('change A:', $event);
    console.log('change B:', JSON.stringify($event));
    this.makeDaysInMonthViewList();
    console.log('setDateSelectionMonth function end');
  }

  makeDaysInMonthViewList() {

    console.log("calling makeDaysInMonthViewList function");
    // List is 6x7, first need to find which day of the week the first is and then prepend from previous:
    // Must fill 42 cells, have n cells in this month...
    console.log("A");
    this.ctrl.monthView.numberOfDaysThisMonth = this.ctrl.dateSelection.daysInMonth();
    this.ctrl.monthView.firstDayOfMonth = moment(this.ctrl.dateSelection).startOf('month');
    this.ctrl.monthView.lastDayOfMonth = moment(this.ctrl.dateSelection).endOf('month');
    var firstDayOfMonthAsWeekday = this.ctrl.monthView.firstDayOfMonth.isoWeekday();
    console.log("B");
    console.log("this.ctrl.dateSelection.daysInMonth()" + this.ctrl.dateSelection.daysInMonth());
    console.log("this.ctrl.monthView.firstDayOfMonth" + this.ctrl.monthView.firstDayOfMonth);
    console.log("this.ctrl.monthView.lastDayOfMonth " + this.ctrl.monthView.lastDayOfMonth);
    console.log("firstDayOfMonthAsWeekday " + firstDayOfMonthAsWeekday);
    console.log("C");

    //var lastDayOfMonthAsWeekday = this.ctrl.monthView.lastDayOfMonth.isoWeekday();
    var firstDayInViewOfPreviousMonth = moment(this.ctrl.monthView.firstDayOfMonth).subtract(firstDayOfMonthAsWeekday - 1, 'days');
    //    console.log('lastDayOfMonthAsWeekday', lastDayOfMonthAsWeekday, 'firstDayInViewOfPreviousMonth', firstDayInViewOfPreviousMonth);
    // Now we have the first and last dates of the grid view, let's make the grid:
    var currentDay = moment(firstDayInViewOfPreviousMonth);
    var days = [];
    var ctrlObj: any = {
      idx: 0,
      reachedEventListEnd: false,
      pastMaxDate: false,
      maxDate: moment(firstDayInViewOfPreviousMonth).add(42, 'days')
    };
    this.ctrl.monthView.days = [];
    for (var i = 0; i < 42; i++) {
      ctrlObj.currentDay = {
        date: moment(currentDay),
        events: []
      };
      if (!(ctrlObj.reachedEventListEnd || ctrlObj.pastMaxDate)) {
        this.findNextEvent(ctrlObj);
      }

      this.ctrl.monthView.days.push(ctrlObj.currentDay);
      currentDay.add(1, 'days');
    }
    // ALSO TO-DO: - Day, week and year view
    //             - Styles and classes for item, icon and text
    this.ctrl.monthView.days.forEach((d: CalendarDay, idx: number) => {
      this.makeExtensionEvents(d, idx);
    });
  }

  private eventFinishesOnDifferentDay(calEvent: CalendarEvent): boolean {
    return !moment(calEvent.startDate).isSame(calEvent.endDate, 'day');
  }

  private insertDate(elem) {
    var insertAt = null;
    this.calEvents.some((ce: CalendarEvent, idx: number) => {
      console.log(ce.startDate.getTime(), elem.startDate.getTime());
      if (ce.startDate.getTime() > elem.startDate.getTime()) {
        insertAt = idx;
        return true;
      }
      return false;
    });
    console.log('Inser at', insertAt, this.calEvents);
    if (insertAt !== null) {
      this.calEvents.splice(insertAt, 0, elem);
    } else {
      this.calEvents.push(elem);
    }
  }

  private makeExtensionEvents(d: CalendarDay, idx: number) {
    if (d.events.length > 0) {
      d.events.forEach((dd: any) => {
        if (dd.isExtension) {
          return;
        }
        dd.isExtension = this.eventFinishesOnDifferentDay(dd);
        dd.extensionMonthViewDayIdxs = [idx];
        var startDateEndOfDay = moment(dd.startDate).endOf('day'),
          endDateEndOfDay = moment(dd.endDate).endOf('day'),
          newEvent, daysPlus = 0;
        while (startDateEndOfDay.isBefore(endDateEndOfDay) && startDateEndOfDay.isBefore(this.ctrl.monthView.days[this.ctrl.monthView.days.length - 1].date)) {
          daysPlus++;
          dd.extensionMonthViewDayIdxs.push(idx + daysPlus);
          if (this.ctrl.monthView.days[idx + daysPlus].events.indexOf(dd) < 0) {
            this.ctrl.monthView.days[idx + daysPlus].events.push(dd);
          }
          startDateEndOfDay.add(1, 'days');
        }
        console.log('dd.extensionMonthViewDayIdxs', dd.extensionMonthViewDayIdxs);
      });
    }
  }

  findNextEvent(ctrlObj: any) {
    if (typeof this.calEvents === 'undefined') {
      return;
    }
    while (true) {
      if (ctrlObj.idx >= this.calEvents.length) {
        ctrlObj.reachedEventListEnd = true;
        return;
      }
      var stDate = this.calEvents[ctrlObj.idx].startDate.getTime();
      if (stDate > ctrlObj.maxDate.valueOf()) { //plus one day here
        ctrlObj.pastMaxDate = true;
        return;
      }
      if (ctrlObj.currentDay.date.valueOf() > stDate) {
        ctrlObj.idx = ctrlObj.idx + 1;
      } else if (ctrlObj.currentDay.date.valueOf() < stDate) {
        if (stDate > moment(ctrlObj.currentDay.date).add(1, 'days').valueOf()) {
          return;
        }
        // Reset isExtension, which could have been added previously:
        this.calEvents[ctrlObj.idx].isExtension = false;
        this.calEvents[ctrlObj.idx].extensionMonthViewDayIdxs = [];
        ctrlObj.currentDay.events.push(this.calEvents[ctrlObj.idx]);
        ctrlObj.idx = ctrlObj.idx + 1;
      }
    }
  }

  @HostListener('window:resize')
  updateSize() {
    var wkds;
    //console.log('this.calendarElement.nativeElement.clientWidth', this.calendarElement.nativeElement.clientWidth);
    if (this.calendarElement.nativeElement.clientWidth < 400) {
      wkds = moment.weekdaysMin();
      if (this.sizeClass !== 'extra-small') {
        this.sizeClass = 'extra-small';
        this.sizeClassChanged = true;
      } else {
        this.sizeClassChanged = false;
      }
    } else if (this.calendarElement.nativeElement.clientWidth < 600) {
      wkds = moment.weekdaysShort();
      if (this.sizeClass !== 'small') {
        this.sizeClass = 'small';
        this.sizeClassChanged = true;
      } else {
        this.sizeClassChanged = false;
      }
    } else {
      wkds = moment.weekdays();
      if (this.sizeClass !== '') {
        this.sizeClass = '';
        this.sizeClassChanged = true;
      } else {
        this.sizeClassChanged = false;
      }
    }
    if (this.sizeClassChanged) {
      this.weekDays = wkds;
    }
  }

  tmpTapCount = 0;
  eventOnClick(item: CalendarEvent, $event) {
    console.log("eventOnClick" + JSON.stringify($event));
    $event.srcEvent.stopPropagation(); // <-- Doesn't seem to work
    this.tmpTapCount = $event.tapCount;
    setTimeout(() => {
      if (this.tmpTapCount === 1) {
        if (this.draggingItem === null) {
          this.events.publish('calendar-event:item-tap', item);
          if (typeof item.ontap === 'function') {
            item.ontap(item);
          } else if (this.onEventTap) {
            this.onEventTap.emit(item);
          }
        }
      } else if (this.tmpTapCount === 2) {
        this.events.publish('calendar-event:item-doubletap', item);
        if (typeof item.ondoubletap === 'function') {
          item.ondoubletap(item);
        } else if (this.onEventDoubleTap) {
          this.onEventDoubleTap.emit(item);
        }
      }
      this.tmpTapCount = 0;
    }, 300);
  }

  stopPressPropagation = false; // <-- Fix to stop mothDayGrid press event to
  //     get triggered too.
  eventOnPress(item: CalendarEvent, $event) {
    console.log("eventOnPress" + JSON.stringify($event));
    $event.srcEvent.stopImmediatePropagation();
    $event.srcEvent.stopPropagation();
    this.stopPressPropagation = true;
    setTimeout(() => {
      this.stopPressPropagation = false;
    }, 100);
    console.log('STOPPED PROPAGATION');
    if (this.draggingItem === null) {
      this.events.publish('calendar-event:item-press', item);
      if (typeof item.onpress === 'function') {
        item.onpress(item);
      } else if (this.onEventPress) {
        this.onEventPress.emit(item);
      }
    }
  }

  monthDayGridCellOnPress(item: CalendarEvent, $event) {
    console.log("monthDayGridCellOnPress function" + $event);
    console.log("monthDayGridCellOnPress function" + JSON.stringify($event));
    $event.srcEvent.stopPropagation(); // <-- Doesn't seem to work
    if (this.draggingItem === null && this.tmpTapCount === 0 && !this.stopPressPropagation) {
      this.events.publish('calendar-event:month-grid-cell-press - calendar.components', item);
    }
  }

  addCalendarEvent(calEvent: CalendarEvent) {
    console.log('adding event', calEvent);
    if (typeof calEvent.id !== 'string') {
      calEvent.id = shortid.generate();
    }
    this.insertDate(calEvent);
    this.ctrl.monthView.days.some((d: CalendarDay) => {
      if (d.date.isSame(calEvent.startDate, 'day')) {
        d.events.push(calEvent);
        return true;
      }
      return false;
    });
  }



  defaultDevent(currentdate, monthstr) {

    this.highlighteddata = [];
    let
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/calendar? is_mobile=1&loginid=" + this.userId + "&date=" + currentdate + "&month=" + monthstr + "&companyid=" + this.companyId + "" + this.typeStr;
    console.log("All Events calling API URL" + url);

    // console.log(url);
    let colors: string[] = ['primary', 'warning', 'danger', 'success'];

    this.http.get(url, options)
      .subscribe((data) => {
        let res = data.json();
        // this.eventIdentify = res.allevents;
        this.eventIdentify = res.events;
        //let highlightdots = res.highlightdots;

        if (res.highlightdots.length > 0) {
          for (let hlgts in res.highlightdots) {
            let splitdatehypen = res.highlightdots[hlgts].date.split("-");
            this.highlighteddata.push({
              date: res.highlightdots[hlgts].date,
              class: res.highlightdots[hlgts].class,
              dte: parseInt(splitdatehypen[2]),
              mne: parseInt(splitdatehypen[1]),
              yrd: splitdatehypen[0],
              cdate: this.currentYear + "-" + this.currentMonth + "-" + this.currentDate
            });
          }
          console.log("Highlight data:" + JSON.stringify(this.highlighteddata))
        }
        for (var i = 0; i < this.eventIdentify.length; i += 1) {
          var startTime;
          var endTime;
          var event_date_array = this.eventIdentify[i]['event_date'].split('-');
          var yearstr = event_date_array[0];
          var monthstr = parseInt(event_date_array[1], 10) - 1;
          var datestr = parseInt(event_date_array[2], 10);
          var startMinute = 20;
          var endMinute = 10 + startMinute;
          startTime = new Date(yearstr, monthstr, datestr, 10, 0 + startMinute);
          endTime = new Date(yearstr, monthstr, datestr, 10, 0 + endMinute);
          this.calEvents.push({
            data: {},
            id: this.eventIdentify[i]['event_id'],
            event_id: this.eventIdentify[i]['event_id'],
            startDate: startTime,
            endDate: endTime,
            name: this.eventIdentify[i]['event_title'],
            type: 'event',
            event_type: 'E',
            allDay: true,
            icon: 'clock',
            class: 'event',
            iconStyle: { color: 'green' },
            style: { color: 'red' },
            eventlength: this.eventIdentify.length,
            event_time: this.eventIdentify[i]['event_time'],
            event_location: this.eventIdentify[i]['event_location'],
            event_remark: this.eventIdentify[i]['event_remark'],
            event_addedby_name: this.eventIdentify[i]['event_addedby_name']
          });
        }


        //this.serviceIdentify = res.allservices;
        this.serviceIdentify = res.services;

        for (var j = 0; j < this.serviceIdentify.length; j += 1) {
          var startTimej;
          var endTimej;
          var service_date_arrayj;

          service_date_arrayj = this.serviceIdentify[j]['next_service_date'];
          /*if (this.serviceIdentify[j]['next_service_date'] == '0000-00-00') {
           service_date_arrayj = this.serviceIdentify[j]['next_service_date'].split('-');
         }
         /*if (this.serviceIdentify[j]['next_service_date'] == '0000-00-00') {
           service_date_arrayj = this.serviceIdentify[j]['next_service_date'].split('-');
         } else {
           if (this.serviceIdentify[j]['serviced_time'] == null) {
             service_date_arrayj = this.serviceIdentify[j]['next_service_date'].split('-');
           } else {
             service_date_arrayj = this.serviceIdentify[j]['serviced_datetime'].split('-');
           }
         }*/
          var yearstrj = service_date_arrayj[0];
          var monthstrj = parseInt(service_date_arrayj[1], 10) - 1;
          var datestrj = parseInt(service_date_arrayj[2], 10);
          var startMinutej = 20;
          var endMinutej = 10 + startMinutej;
          startTimej = new Date(yearstrj, monthstrj, datestrj, 10, 0 + startMinutej);
          endTimej = new Date(yearstrj, monthstrj, datestrj, 10, 0 + endMinutej);

          this.calEvents.push({
            data: {},
            id: this.serviceIdentify[j]['service_id'],
            event_id: this.serviceIdentify[j]['service_id'],
            startDate: startTimej,
            endDate: endTimej,
            name: this.serviceIdentify[j]['service_subject'],
            unitname: this.serviceIdentify[j]['unitname'],
            type: 'event',
            allDay: true,
            icon: 'camera',
            event_type: 'S',
            class: 'service',
            iconStyle: { color: 'green' },
            style: { color: 'green' },
            servicelength: this.serviceIdentify.length,
            event_time: this.serviceIdentify[j]['serviced_time'],
            event_remark: this.serviceIdentify[j]['service_remark'],
            event_location: this.serviceIdentify[j]['service_location'],
            event_addedby_name: this.serviceIdentify[j]['serviced_by_name']
          });


        }


        //this.alarmIdentity = res.allalarms;
        this.alarmIdentity = res.alarms;
        for (var k = 0; k < this.alarmIdentity.length; k += 1) {
          var startTimeAlarm;
          var endTimeAlarm;
          var substrdt = this.alarmIdentity[k]['alarm_received_date'];//.substring(0, 10)'         
          var service_date_arrayk = substrdt.split('-');
          var yearstrk = service_date_arrayk[0];
          var monthstrk = parseInt(service_date_arrayk[1], 10) - 1;
          var datestrk = parseInt(service_date_arrayk[2], 10);
          var startMinuteAlam = 20;
          var endMinuteAlarm = 10 + startMinute;

          startTimeAlarm = new Date(yearstrk, monthstrk, datestrk, 10, 0 + startMinuteAlam);
          endTimeAlarm = new Date(yearstrk, monthstrk, datestrk, 10, 0 + endMinuteAlarm);

          this.calEvents.push({
            data: {},
            id: this.alarmIdentity[k]['alarm_id'],
            event_id: this.alarmIdentity[k]['alarm_id'],
            startDate: startTimeAlarm,
            endDate: endTimeAlarm,
            name: this.alarmIdentity[k]['alarm_name'],
            unitname: this.alarmIdentity[k]['unitname'],
            type: 'event',
            allDay: true,
            event_type: 'A',
            icon: 'alarm',
            class: 'alarm',
            iconStyle: { color: 'orange' },
            style: { color: 'orange' },
            alarmlength: this.alarmIdentity.length,
            event_remark: this.alarmIdentity[k]['alarm_remark'],
            event_location: this.alarmIdentity[k]['alarm_location'],
            event_addedby_name: this.alarmIdentity[k]['alarm_assginedby_name']
          });


        }


        // If the request was successful notify the user
        if (data.status === 200) {


        }
        // Otherwise let 'em know anyway
        else {

        }


        console.log("Calendar Component" + JSON.stringify(this.calEvents));
        this.totalCountEventDateWise = this.calEvents.length;
        if (this.totalCountEventDateWise == 0) {
          this.noeventtitle = 'There is no events';
        }
        //this.makeDaysInMonthViewList();
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }

  doAdd() {
    localStorage.setItem("atMentionResult", "");
    this.navCtrl.setRoot(AddcalendarPage);
  }

  doCalendarDelete(item, action) {
    console.log("Deleted Id" + item.event_id);
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(item.event_id, action);
          for (let q: number = 0; q < this.calEvents.length; q++) {
            if (this.calEvents[q] == item) {
              this.calEvents.splice(q, 1);
            }
          }
        }
      },
      {
        text: 'No',
        handler: () => { }
      }]
    });
    confirm.present();
  }
  doCalendarEdit(item, type) {
    localStorage.setItem("atMentionResult", "");
    this.navCtrl.setRoot(AddcalendarPage, {
      item: item,
      type: type
    });
  }

  doCalendarView(event_id) {
    this.navCtrl.push(CalendardetailPage, {
      event_id: event_id
    });
  }

  doAlarmView(event_id) {
    this.navCtrl.push(AlarmdetailsPage, {
      record: event_id,
      act: 'Push'
    });
  }
  deleteEntry(recordID, deltype) {
    let delactionurl;
    if (deltype == 'Event') {
      delactionurl = "/calendar/" + recordID + "/1/deleteevent";
    } else if (deltype == 'Service') {
      delactionurl = "/calendar/" + recordID + "/1/deleteservice";

    } else if (deltype == 'Alarm') {
      delactionurl = "/calendar/" + recordID + "/1/deletealarm";
    }
    let
      //body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + delactionurl;
    console.log("Event Deleted API Url:" + url);
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {
          if (deltype == 'Event') {
            this.conf.sendNotification(`Event was successfully deleted`);
          }
          if (deltype == 'Service') {
            this.conf.sendNotification(`Service was successfully deleted`);
          }
          if (deltype == 'Alarm') {
            this.conf.sendNotification(`Alarm was successfully deleted`);
          }
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }


  onTimeSelected(year, month, date, ev) {
    this.onLoad = true;
    console.log(year + "-" + month + "-" + date);
    this.currentDate = date;
    this.currentYear = year;
    this.currentMonth = month;
    console.log("One time selected date is:" + this.currentDate);
    console.log("Current Year is:" + this.currentYear);
    console.log("Current Date is:" + this.currentDate);
    console.log("Current Month is:" + this.currentMonth);


    this.currentCalendarDate = ev;
    this.calendarResultAll = [];
    this.calendarResultService = [];
    this.calendarResultEvent = [];
    this.calendarResultAlarm = [];

    // this.createRandomEvents();
    let dateStr;
    let typeStr;

    if (ev != '') {
      //this.pet = '';
      this.petselection = '';
      this.calendarResultAll = [];
      this.calendarResultService = [];
      this.calendarResultEvent = [];
      this.calendarResultAlarm = [];


      if (ev.selectedTime == undefined) {

        month = month
        date = date;
      } else {

        month = month;
        year = year;
        date = date;
      }

      if (this.getlength(month) == 1) {
        month = '0' + month;
      } else {
        month = month;
      }


      if (this.getlength(date) == 1) {
        date = '0' + date
      } else {
        date = date;
      }

      dateStr = "&date=" + year + "-" + month + "-" + date;
      typeStr = '';
      this.typeStr = '';
      if (this.pet == 'ALL') {
        typeStr = '&type=all';
        this.typeStr = typeStr;
      } else if (this.pet == 'SERVICE') {
        typeStr = '&type=service';
        this.typeStr = typeStr;
      } else if (this.pet == 'EVENT') {
        typeStr = '&type=event';
        this.typeStr = typeStr;
      } else if (this.pet == 'ALARM') {
        typeStr = '&type=alarm';
        this.typeStr = typeStr;
      }

    } else {
      // dateStr = "";
      dateStr = "&date=" + year + "-" + month + "-" + date;
      if (this.pet == 'ALL') {
        typeStr = '&type=all';
      } else if (this.pet == 'SERVICE') {
        typeStr = '&type=service';
      } else if (this.pet == 'EVENT') {
        typeStr = '&type=event';
      } else if (this.pet == 'ALARM') {
        typeStr = '&type=alarm';
      }
      this.typeStr = typeStr;
      this.defaultDevent('', this.monthstr);
    }

    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/calendar?is_mobile=1&loginid=" + this.userId + "&companyid=" + this.companyId + "" + dateStr + "&month=" + this.monthstr + "" + typeStr;
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        let currentDateArr = new Date();
        let cmonth = currentDateArr.getMonth() + 1;
        let mnstr;
        let dtstr;
        console.log("cmonth.toLocaleString.length" + cmonth.toLocaleString.length);
        console.log("cmonth" + cmonth)
        if (cmonth > 9) {
          cmonth = cmonth;
          mnstr = '';
          console.log("Less than 9 below 10")

        } else {
          console.log("Greater than 9 reach 10")
          cmonth = cmonth;
          mnstr = '0';

        }

        if (currentDateArr.getDate()>9) {
          dtstr = '';
        } else {
          dtstr = '0';

        }

        console.log("Date length string:-"+this.getlength(currentDateArr.getDate()));

        let curDate = currentDateArr.getFullYear() + "-" + mnstr + cmonth + "-" + dtstr + currentDateArr.getDate();

        let months = { '01': 'January', '02': 'February', '03': 'March', '04': 'April', '05': 'May', '06': 'June', '07': 'July', '08': 'August', '09': 'September', '10': 'October', '11': 'November', '12': 'December' };

        let selDate = year + "-" + month + "-" + date;
        if (selDate == '--') {
          localStorage.setItem("eventDate", curDate);
        } else {
          localStorage.setItem("eventDate", selDate);
        }

        let selectdate = year + "-" + month + "-" + date;
        if (year != undefined)
          this.dateHeaderTitle = months[month] + " " + year;
        if (ev != '') {
          console.log("curDate:" + curDate);
          console.log("selDate:" + selDate);
          localStorage.setItem("sdate", selectdate);
          /*if (curDate == selDate) {
            this.daySession = 'upcoming Event today';
            console.log(this.daySession);
          } else {
            this.daySession = this.currentDateFormatToday;
            //this.daySession = 'upcoming Event today';
          }*/
        } else {
         // this.daySession = this.currentDateFormatToday;
          //this.daySession = 'upcoming Event today';
        }
        this.calendarResultEvent = [];
        if (this.petselection == 'ALL') {
          console.log('ALL');
          this.doCalendarResult(data, 0, 0, 0, 'all')
        } else if (this.petselection == 'SERVICE') {
          console.log('SERVICE');
          this.doCalendarResult(data, 0, 0, 0, 'service');//JsonData,Event,Service,Alarm
        } else if (this.petselection == 'EVENT') {
          console.log('EVENT');
          this.doCalendarResult(data, 0, 0, 0, 'event');//JsonData,Event,Service,Alarm
        } else if (this.petselection == 'ALARM') {
          console.log('ALARM');
          this.doCalendarResult(data, 0, 0, 0, 'alarm');//JsonData,Event,Service,Alarm
        } else {
          console.log('EV' + ev);
          if (ev != '') {
            this.doCalendarResult(data, 1, 1, 1, '')//JsonData,Event,Service,Alarm
          }

        }

        let cdateform = this.currentDateFormatToday.split(" ");
        let weekdayname = this.getDayOfWeek(selectdate);
        if (curDate == selDate) {
          // this.daySession
          if (this.totalCountEventDateWise > 0) {
            this.daySession = this.totalCountEventDateWise + ' upcoming Event today';
          }
          this.currentDateFormatToday = weekdayname.substr(0, 3) + " " + date + " " + cdateform[2] + " " + cdateform[3];
        } else {
          this.daySession = '';
          this.currentDateFormatToday = "" + weekdayname.substr(0, 3) + " " + date + " " + cdateform[2] + " " + cdateform[3];
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });


  }
  getDayOfWeek(date) {
    var dayOfWeek = new Date(date).getDay();
    return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
  }
  doCalendarResult(data, event, service, alarm, type) {//JsonData,Event,Service,Alarm
    this.serviceIdentify = [];
    this.eventIdentify = [];
    this.alarmIdentity = [];
    /*if (event > 0 && type == '') {
      console.log("A");
      this.eventIdentify = data.json().events;
    } else {
      console.log("B");
      if (type == 'event') {
        console.log("C");
        this.eventIdentify = data.json().allevents;
      }
      if (type == 'all') {
        console.log("D");
        this.eventIdentify = data.json().allevents;
      }
    }*/
    this.eventIdentify = data.json().events;
    for (var i = 0; i < this.eventIdentify.length; i += 1) {
      //  $('.monthview-primary-with-event').removeClass('monthview-primary-with-event[_ngcontent-c1]');
      // $('.monthview-primary-with-event').addClass('eventclass');
      //let eventdate = this.eventIdentify[i]['event_date'] + " " + this.eventIdentify[i]['event_time'];// Check Date and Time
      // let eventdate = this.eventIdentify[i]['event_date'];// Check Date only
      this.calendarResultEvent.push({
        event_id: this.eventIdentify[i]['event_id'],
        event_title: this.eventIdentify[i]['event_title'],
        event_date: this.eventIdentify[i]['event_date'],
        event_time: this.eventIdentify[i]['event_time'],
        event_location: this.eventIdentify[i]['event_location'],
        event_remark: this.eventIdentify[i]['event_remark'],
        event_addedby_name: this.eventIdentify[i]['event_addedby_name'],
        formatted_datetime: this.eventIdentify[i]['formatted_datetime'],
        event_type: 'E',
        icon: 'alarm', // Icon of the alert. This is compulsory when using the 
        // calendar on small screens, as the name of the event will
        // not be displayed in the month grid. It has to be a valid
        // IonicIcons icon name.
        class: 'eventclass', // Class of the item in the month grid cell
        iconStyle: { color: 'green' } // Style for the item's icon
        //style: { color: 'red' }, // Style for the item
      });
    }

    /*if (service > 0 && type == '') {
      console.log("E");
      this.serviceIdentify = data.json().services;
    } else {
      console.log("F");
      if (type == 'service') {
        console.log("G");
        this.serviceIdentify = data.json().allservices;
      }
      if (type == 'all') {
        console.log("H");
        this.serviceIdentify = data.json().allservices;
      }
    }*/
    //this.serviceIdentify = data.json().allservices;
    this.serviceIdentify = data.json().services;
    for (var j = 0; j < this.serviceIdentify.length; j += 1) {
      let eventdate;

      /*  if (this.serviceIdentify[j]['serviced_datetime'] == '0000-00-00') {
          //eventdate = this.serviceIdentify[j]['next_service_date'] + " " + this.serviceIdentify[j]['serviced_time'];// Check Date and Time
          eventdate = this.serviceIdentify[j]['next_service_date'];// Check Date only
        } else {
          if (this.serviceIdentify[j]['serviced_time'] == null) {
            eventdate = this.serviceIdentify[j]['next_service_date'];
          } else {
            eventdate = this.serviceIdentify[j]['serviced_datetime'];
          }
        }
  */


      eventdate = this.serviceIdentify[j]['next_service_date'];
      /*   if (this.serviceIdentify[j]['next_service_date'] == '0000-00-00') {
          eventdate = this.serviceIdentify[j]['next_service_date'].split('-');
        }*/



      this.calendarResultEvent.push({
        event_id: this.serviceIdentify[j]['service_id'],
        event_title: this.serviceIdentify[j]['service_subject'],
        event_unitid: this.serviceIdentify[j]['service_unitid'],
        unitname: this.serviceIdentify[j]['unitname'],
        event_date: this.serviceIdentify[j]['next_service_date'],
        event_time: this.serviceIdentify[j]['serviced_time'],
        event_remark: this.serviceIdentify[j]['service_remark'],
        event_location: this.serviceIdentify[j]['service_location'],
        event_addedby_name: this.serviceIdentify[j]['serviced_by_name'],
        formatted_datetime: this.serviceIdentify[j]['formatted_datetime'],
        event_type: 'S',
        icon: 'service',
        class: 'service'
      });

    }
    /*
        if (alarm > 0 && type == '') {
          console.log("I");
          this.alarmIdentity = data.json().alarms;
        } else {
          console.log("J");
          if (type == 'alarm') {
            console.log("K");
            this.alarmIdentity = data.json().allalarms;
          }
          if (type == 'all') {
            console.log("L");
            this.alarmIdentity = data.json().allalarms;
          }
        }
    */
    //this.alarmIdentity = data.json().allalarms;
    this.alarmIdentity = data.json().alarms;
    for (var k = 0; k < this.alarmIdentity.length; k += 1) {

      this.calendarResultEvent.push({

        event_id: this.alarmIdentity[k]['alarm_id'],
        event_title: this.alarmIdentity[k]['alarm_name'],
        event_unitid: this.alarmIdentity[k]['alarm_unit_id'],
        event_date: this.alarmIdentity[k]['alarm_received_date'],
        unitname: this.alarmIdentity[k]['unitname'],
        event_remark: this.alarmIdentity[k]['alarm_remark'],
        event_location: this.alarmIdentity[k]['alarm_location'],
        event_addedby_name: this.alarmIdentity[k]['alarm_assginedby_name'],
        event_t: this.alarmIdentity[k]['date_time'],
        formatted_datetime: this.alarmIdentity[k]['formatted_datetime'],
        event_type: 'A',
        icon: 'event',
        class: 'event'
      });


    }
    this.totalCountEventDateWise = this.calendarResultEvent.length;
    console.log("Date wise selection calendar response:" + JSON.stringify(this.calendarResultEvent));
    console.log("totalCountEventDateWise++" + this.totalCountEventDateWise);
    if (this.totalCountEventDateWise == 0) {
      this.noeventtitle = 'There is no events';
    }
    this.makeDaysInMonthViewList();
  }


  /**********************************/
  /* Dropdown Filter onchange event */
  /**********************************/
  onSegmentChanged(val) {
    this.noeventtitle = '';
    this.calendarResultEvent = [];
    this.calendarResultAll = [];
    this.calendarResultService = [];
    this.calendarResultAlarm = [];
    if (val == "ALL") {
      // this.reportData.status = "DRAFT";
      // this.reportData.startindex = 0;
      this.calendarResultAll = [];
      this.petselection = 'ALL';
      this.allselected = true;
      this.pet = 'ALL';

    } else if (val == "SERVICE") {
      this.serviceselected = true;

      //this.reportData.status = val;
      //this.reportData.startindex = 0;
      this.calendarResultService = [];
      this.petselection = 'SERVICE';
      this.pet = 'SERVICE';
    } else if (val == "EVENT") {

      this.eventsselected = true;
      //this.reportData.status = val;
      //this.reportData.startindex = 0;
      this.calendarResultEvent = [];
      this.petselection = 'EVENT';
      this.pet = 'EVENT';
    } else if (val == "ALARM") {
      this.alarmselected = true;
      //this.reportData.status = val;
      //this.reportData.startindex = 0;
      this.calendarResultAlarm = [];
      this.petselection = 'ALARM';
      this.pet = 'ALARM';
    } else {
      this.pet = '';
    }

    this.ctrl = {
      viewMode: 'month',
      dateSelection: moment(),
      selectedYear: moment().year(),
      selectedMonth: this.months[moment().month()],
      selectedDay: moment().date(),
      monthView: {
        days: [],
        numberOfDaysThisMonth: 0,
        firstDayOfMonth: null,
        lastDayOfMonth: null,
        selectedDate: null
      },
      weekView: {
        days: [],
        firstDayOfWeek: null,
        lastDayOfWeek: null,
        selectedDate: null
      }
    };

    console.log("ngOnInit" + JSON.stringify(this.ctrl));
    let mn = moment().month() + 1;


    if (this.getlength(mn) == 1) {
      this.month = '0' + mn;
    } else {
      this.month = mn;
    }


    if (this.getlength(this.ctrl.selectedDay) == 1) {
      this.date = '0' + this.ctrl.selectedDay
    } else {
      this.date = this.ctrl.selectedDay;
    }

    let currentDate = this.ctrl.selectedYear + "-" + this.month + "-" + this.date;

    //let selDate = currentDate;

    this.onTimeSelected(this.ctrl.selectedYear, this.month, this.date, '');

    console.log("Filter for Date" + currentDate);
    localStorage.setItem("eventDate", currentDate);
  }


  swipeopensliding(slidingItem: ItemSliding) {
    console.log("Slide 1");
    slidingItem.getOpenAmount();
    console.log("Slide 2");
  }

}
