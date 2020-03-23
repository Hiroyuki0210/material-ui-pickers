import * as React from 'react';
import * as PropTypes from 'prop-types';
import clsx from 'clsx';
import { ExtendMui } from '../../typings/helpers';
import { useUtils } from '../../_shared/hooks/useUtils';
import { MaterialUiPickersDate } from '../../typings/date';
import { makeStyles, fade } from '@material-ui/core/styles';
import { ButtonBase, ButtonBaseProps } from '@material-ui/core';
import { DAY_SIZE, DAY_MARGIN } from '../../constants/dimensions';

export const useStyles = makeStyles(
  theme => ({
    day: {
      width: DAY_SIZE,
      height: DAY_SIZE,
      borderRadius: '50%',
      padding: 0,
      // background required here to prevent collides with the other days when animating with transition group
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      fontSize: theme.typography.caption.fontSize,
      fontWeight: theme.typography.fontWeightMedium,
      '&:hover': {
        backgroundColor: fade(theme.palette.action.active, theme.palette.action.hoverOpacity),
      },
      '&:focus': {
        backgroundColor: fade(theme.palette.action.active, theme.palette.action.hoverOpacity),
        '&$daySelected': {
          willChange: 'background-color',
          backgroundColor: theme.palette.primary.dark,
        },
      },
    },
    dayWithMargin: {
      margin: `0px ${DAY_MARGIN}px`,
    },
    dayOutsideMonth: {
      color: theme.palette.text.hint,
    },
    hidden: {
      opacity: 0,
      pointerEvents: 'none',
    },
    today: {
      '&:not($daySelected)': {
        border: `1px solid ${theme.palette.text.hint}`,
      },
    },
    daySelected: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightMedium,
      transition: theme.transitions.create('background-color', {
        duration: theme.transitions.duration.short,
      }),
      '&:hover': {
        willChange: 'background-color',
        backgroundColor: theme.palette.primary.dark,
      },
    },
    dayDisabled: {
      pointerEvents: 'none',
      color: theme.palette.text.hint,
    },
    dayLabel: {
      // need for overrides
    },
  }),
  { name: 'MuiPickersDay' }
);

export interface DayProps extends ExtendMui<ButtonBaseProps> {
  /** The date to show */
  day: MaterialUiPickersDate;
  /** Is focused by keyboard navigation */
  focused?: boolean;
  /** Can be focused by tabbing in */
  focusable?: boolean;
  /** Is day in current month */
  inCurrentMonth: boolean;
  /** Is switching month animation going on right now */
  isAnimating?: boolean;
  /** Is today? */
  today?: boolean;
  /** Disabled? */
  disabled?: boolean;
  /** Selected? */
  selected?: boolean;
  /** Is keyboard control and focus management enabled */
  allowKeyboardControl?: boolean;
  /** Disable margin between days, useful for displaying range of days */
  disableMargin?: boolean;
  /**
   * Display disabled dates outside the current month
   * @default false
   */
  showDaysOutsideCurrentMonth?: boolean;
  /** Disable highlighting today date with a circle
   * @default false
   */
  disableHighlightToday?: boolean;
}

export const Day: React.FC<DayProps> = ({
  className,
  day,
  disabled,
  hidden,
  inCurrentMonth: isInCurrentMonth,
  today: isToday,
  selected,
  focused = false,
  focusable = false,
  isAnimating,
  onFocus,
  disableMargin = false,
  allowKeyboardControl,
  disableHighlightToday = false,
  showDaysOutsideCurrentMonth = false,
  ...other
}) => {
  const ref = React.useRef<HTMLButtonElement>(null);
  const utils = useUtils();
  const classes = useStyles();

  React.useEffect(() => {
    if (
      focused &&
      !disabled &&
      !isAnimating &&
      isInCurrentMonth &&
      ref.current &&
      allowKeyboardControl
    ) {
      ref.current.focus();
    }
  }, [allowKeyboardControl, disabled, focused, isAnimating, isInCurrentMonth]);

  const isHidden = !isInCurrentMonth && !showDaysOutsideCurrentMonth;
  return (
    <ButtonBase
      aria-hidden={isHidden}
      ref={ref}
      centerRipple
      data-mui-test="day"
      aria-label={utils.format(day, 'fullDate')}
      tabIndex={focused || focusable ? 0 : -1}
      className={clsx(
        classes.day,
        {
          [classes.daySelected]: selected,
          [classes.dayDisabled]: disabled,
          [classes.dayWithMargin]: !disableMargin,
          [classes.today]: !disableHighlightToday && isToday,
          [classes.hidden]: isHidden,
          [classes.dayOutsideMonth]: !isInCurrentMonth && showDaysOutsideCurrentMonth,
        },
        className
      )}
      onFocus={e => {
        if (!focused && onFocus) {
          onFocus(e);
        }
      }}
      {...other}
    >
      <span className={classes.dayLabel}>{utils.format(day, 'dayOfMonth')}</span>
    </ButtonBase>
  );
};

Day.displayName = 'Day';

Day.propTypes = {
  today: PropTypes.bool,
  disabled: PropTypes.bool,
  selected: PropTypes.bool,
};

Day.defaultProps = {
  disabled: false,
  today: false,
  selected: false,
};
