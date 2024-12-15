/**
 * Class to manage handling stdout from our IDLMachine process
 *
 * Makes sure we process messages in order so that we dont stomp on previous values
 */
export class OutputQueue {
  /**
   * Pending items that we need to process
   */
  private pending: string[] = [];

  /**
   * Are we processing an item already?
   */
  private processing = false;

  /**
   * total output we have captured
   */
  private captured = '';

  /**
   * Number of items we have opened of closed from JSON parsing perspective
   */
  private opened = 0;

  /**
   * Callback for messages we receive
   */
  private onMessage: (msg: string) => void;

  constructor(onMessage: (msg: string) => void) {
    this.onMessage = onMessage;
  }

  /**
   * When we have output that we need to check
   */
  handleOutput(output: string) {
    // add to list for us to parse through and check
    this.pending.push(output);

    // check current output
    this._next();
  }

  /**
   * Attempt to parse output
   */
  private _next() {
    // return if already processing
    if (this.processing) {
      return;
    }

    // return if no messages
    if (this.pending.length === 0) {
      return;
    }

    // update processing flag
    this.processing = true;

    // update content we are parsing
    this.captured = `${this.captured}${this.pending.shift()}`;

    // reset opened
    this.opened = 0;

    /** Did we find something to make us check more? */
    let foundOpenerOrCloser = false;

    /** Do we recursively check for more messages */
    let keepChecking = true;

    /**
     * Find messages until we cant
     */
    while (keepChecking) {
      // check for messages
      for (let i = 0; i < this.captured.length; i++) {
        /**
         * Are we processing a character past the start?
         */
        if (i > 0) {
          switch (true) {
            case this.captured[i] === '{' && this.captured[i - 1] !== '\\':
              this.opened++;
              foundOpenerOrCloser = true;
              break;
            case this.captured[i] === '}' && this.captured[i - 1] !== '\\':
              this.opened--;
              foundOpenerOrCloser = true;
              break;
            default:
              break;
          }
          /**
           * First character
           */
        } else {
          switch (true) {
            case this.captured[i] === '{':
              this.opened++;
              foundOpenerOrCloser = true;
              break;
            case this.captured[i] === '}':
              this.opened--;
              foundOpenerOrCloser = true;
              break;
            default:
              break;
          }
        }

        // see if we are closed
        if (this.opened === 0 && foundOpenerOrCloser) {
          // reset flag
          foundOpenerOrCloser = false;

          // emit message
          this.onMessage(this.captured.substring(0, i + 1));

          // update message
          this.captured = this.captured.substring(i + 1);

          // see if we need to keep checking or not
          if (this.captured.length !== 0) {
            keepChecking = true;
          } else {
            keepChecking = false;
          }

          // exit and re-start our search
          break;
        } else {
          keepChecking = false;
        }
      }
    }

    // update flag
    this.processing = false;

    this._next();
  }
}
